export const updateData = <T>(initialData: T, updatedData: T) => {
  for (const key in updatedData) {
    if (
      Object.prototype.hasOwnProperty.call(updatedData, key) &&
      initialData[key] !== updatedData[key]
    ) {
      initialData[key] = updatedData[key];
    }
  }
};
