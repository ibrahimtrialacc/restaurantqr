export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "springfield",
    name: "Tasty Bites - Springfield",
    address: "123 Main St, Springfield",
    phone: "(555) 123-4567",
    hours: "Mon-Sun: 11:00 AM - 10:00 PM",
  },
  {
    id: "shelbyville",
    name: "Tasty Bites - Shelbyville",
    address: "456 Oak Ave, Shelbyville",
    phone: "(555) 987-6543",
    hours: "Mon-Sun: 10:00 AM - 11:00 PM",
  },
];