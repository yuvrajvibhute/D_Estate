export interface Property {
  id: string;
  title: string;
  price: number;
  owner: string;
  location: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

// In a real MVP with a deployed contract, these would use stellar-sdk and invoke Soroban.
// For demonstration, we keep local state and simulate delays to show loading states required by MVP.

const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Glass Villa",
    price: 50000,
    owner: "GA7Q...3Z21",
    location: "Neo Tokyo District",
    description: "A stunning modern glass villa with smart home integrated features and panoramic views.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    active: true
  },
  {
    id: "2",
    title: "Cyberpunk Loft",
    price: 15000,
    owner: "GB2X...9F8A",
    location: "Sector 7, Midgar",
    description: "Industrial style cyberpunk loft with exposed brick and neon accents.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
    active: true
  },
  {
    id: "3",
    title: "Minimalist Desert Retreat",
    price: 35000,
    owner: "GD55...1L9P",
    location: "New Vegas Outskirts",
    description: "Eco-friendly minimalist home powered completely by solar energy.",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    active: true
  }
];

let globalProperties = [...MOCK_PROPERTIES];

export const getProperties = async (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(globalProperties.filter(p => p.active));
    }, 800);
  });
};

export const getOwnedProperties = async (address: string): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(globalProperties.filter(p => !p.active && p.owner === address));
    }, 800);
  });
};

export const registerProperty = async (
  title: string,
  price: number,
  location: string,
  description: string,
  owner: string
): Promise<Property> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProp: Property = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        price,
        owner,
        location,
        description,
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800", // Default image
        active: true
      };
      globalProperties.push(newProp);
      resolve(newProp);
    }, 1500);
  });
};

export const buyProperty = async (id: string, buyerInfo: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const propIndex = globalProperties.findIndex(p => p.id === id);
      if (propIndex !== -1) {
        globalProperties[propIndex].owner = buyerInfo;
        globalProperties[propIndex].active = false;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 2000);
  });
};
