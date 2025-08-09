// Gumroad API integration
// Documentation: https://gumroad.com/api

const GUMROAD_BASE_URL = 'https://api.gumroad.com/v2';
const ACCESS_TOKEN = 'F36ZAOZlVJOgDZuiAfGaseb3xEcVRk48LF9CQ8EOZFU';

/**
 * Fetch all products from Gumroad
 * @returns {Promise<Array>} - A promise that resolves to an array of products
 */
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${GUMROAD_BASE_URL}/products?access_token=${ACCESS_TOKEN}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API returned unsuccessful status');
    }
    
    return data.products;
  } catch (error) {
    console.error('Error fetching Gumroad products:', error);
    throw error;
  }
};
