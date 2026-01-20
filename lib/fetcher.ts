export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export const mutationFetcher = <TData = unknown>(
  url: string,
  { arg }: { arg: FormData | Record<string, unknown> },
): Promise<TData> => {
  const isFormData = arg instanceof FormData;

  return fetch(url, {
    method: "POST",
    body: isFormData ? arg : JSON.stringify(arg),
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  }).then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to complete request");
    }

    return data;
  });
};
