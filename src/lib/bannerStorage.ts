/**
 * Utility for storing banner images in IndexedDB to avoid localStorage quota issues
 * Stores metadata in localStorage and images in IndexedDB
 */

interface Banner {
  id: number;
  image?: string | null;
  label?: string;
  error?: string;
  size?: string;
  archetype?: string;
  hasBrandAssets?: boolean;
  prompt?: string;
}

const DB_NAME = 'LinkToAdsBanners';
const DB_VERSION = 1;
const STORE_NAME = 'banners';

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Save banners: metadata in localStorage, images in IndexedDB
export const saveBanners = async (banners: Banner[]): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Save metadata (without images) to localStorage
    const metadata = banners.map(({ image, ...rest }) => rest);
    localStorage.setItem('generatedBanners', JSON.stringify(metadata));

    // Save images to IndexedDB
    const savePromises = banners.map((banner) => {
      if (banner.image) {
        return new Promise<void>((resolve, reject) => {
          const request = store.put({
            id: banner.id,
            image: banner.image,
          });
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
      return Promise.resolve();
    });

    await Promise.all(savePromises);
    transaction.oncomplete = () => db.close();
  } catch (error) {
    console.error('Error saving banners:', error);
    // Fallback: try to save without images if IndexedDB fails
    const metadata = banners.map(({ image, ...rest }) => rest);
    localStorage.setItem('generatedBanners', JSON.stringify(metadata));
    throw error;
  }
};

// Load banners: combine metadata from localStorage with images from IndexedDB
export const loadBanners = async (): Promise<Banner[]> => {
  try {
    // Load metadata from localStorage
    const metadataStr = localStorage.getItem('generatedBanners');
    if (!metadataStr) return [];

    const metadata: Omit<Banner, 'image'>[] = JSON.parse(metadataStr);

    // Load images from IndexedDB
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const banners: Banner[] = await Promise.all(
      metadata.map(async (meta) => {
        return new Promise<Banner>((resolve, reject) => {
          const request = store.get(meta.id);
          request.onsuccess = () => {
            const imageData = request.result?.image || null;
            resolve({
              ...meta,
              image: imageData,
            });
          };
          request.onerror = () => {
            // If image not found in IndexedDB, return without image
            resolve({
              ...meta,
              image: null,
            });
          };
        });
      })
    );

    transaction.oncomplete = () => db.close();
    return banners;
  } catch (error) {
    console.error('Error loading banners:', error);
    // Fallback: try to load metadata only
    const metadataStr = localStorage.getItem('generatedBanners');
    if (metadataStr) {
      const metadata: Omit<Banner, 'image'>[] = JSON.parse(metadataStr);
      return metadata.map((meta) => ({ ...meta, image: null }));
    }
    return [];
  }
};

// Update a single banner
export const updateBanner = async (banner: Banner): Promise<void> => {
  try {
    // Load all banners
    const banners = await loadBanners();
    
    // Update the specific banner
    const updated = banners.map((b) => (b.id === banner.id ? banner : b));
    
    // Save all banners
    await saveBanners(updated);
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

// Clear all banners
export const clearBanners = async (): Promise<void> => {
  try {
    localStorage.removeItem('generatedBanners');
    
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.clear();
    transaction.oncomplete = () => db.close();
  } catch (error) {
    console.error('Error clearing banners:', error);
  }
};
