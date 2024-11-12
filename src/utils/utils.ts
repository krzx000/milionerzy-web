export const post = async (endpoint: string, data?: Record<string, unknown>) => {
  try {
    const res = await fetch("http://localhost:3000" + endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    console.log(await res.json());
  } catch (err) {
    console.error("Failed to fetch:", err);
  }
};

export const get = async (endpoint: string) => {
  try {
    const res = await fetch("http://localhost:3000" + endpoint, {
      method: "GET",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    console.log(await res.json());
  } catch (err) {
    console.error("Failed to fetch:", err);
  }
};

export const getStatus = async () => {
  get("/status");
};
