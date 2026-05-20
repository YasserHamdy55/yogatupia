export const mergeManagedCollection = (items, managedItems) =>
  items.map((item, index) => ({
    ...item,
    ...(managedItems[index] || {}),
  }));