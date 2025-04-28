export const getAllEvents = async () => {
  const res = await fetch("http://localhost:5000/api/event/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
