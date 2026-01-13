import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Upload image to Supabase Storage
export const uploadImage = async (
  base64Image: string,
  fileName: string
): Promise<{ url: string | null; error: string | null }> => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    const base64Data = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;
    
    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('campaign-images')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('campaign-images')
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error('Upload exception:', err);
    return { url: null, error: 'Failed to upload image' };
  }
};

// Save ad to database
export interface AdData {
  userId: string;
  title: string;
  content: string;
  imageUrl: string;
  platform?: string;
}

export const saveAd = async (adData: AdData): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase.from('ads').insert({
      user_id: adData.userId,
      title: adData.title,
      content: adData.content,
      image_url: adData.imageUrl,
      platform: adData.platform || 'general',
      status: 'saved',
    });

    if (error) {
      console.error('Save ad error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Save ad exception:', err);
    return { success: false, error: 'Failed to save ad' };
  }
};

// Save campaign (multiple ads)
export const saveCampaign = async (
  userId: string,
  ads: Array<{
    image: string;
    caption: string;
    title?: string;
  }>
): Promise<{ success: boolean; savedCount: number; error: string | null }> => {
  let savedCount = 0;
  
  for (const ad of ads) {
    // Generate unique filename
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    // Upload image
    const { url, error: uploadError } = await uploadImage(ad.image, fileName);
    
    if (uploadError || !url) {
      console.error('Failed to upload image:', uploadError);
      continue;
    }
    
    // Save ad to database
    const { success, error: saveError } = await saveAd({
      userId,
      title: ad.title || 'Campaign Ad',
      content: ad.caption,
      imageUrl: url,
    });
    
    if (success) {
      savedCount++;
    } else {
      console.error('Failed to save ad:', saveError);
    }
  }
  
  return {
    success: savedCount > 0,
    savedCount,
    error: savedCount === 0 ? 'Failed to save any ads' : null,
  };
};

// Google OAuth sign in
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google sign in error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

// Get current Supabase session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error);
    return null;
  }
  return session;
};

// Sign out from Supabase
export const signOutSupabase = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    return false;
  }
  return true;
};
