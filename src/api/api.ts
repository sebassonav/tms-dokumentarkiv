import { postUserUrl } from "../urls";

interface Props {
  path: string;
  options?: object;
  eventObj?: object;
}

interface eventObjectProps {
  event: string;
}

export const include = {
  credentials: "include",
};

export const fetcher = async ({ path, options }: Props) => {
  const response = await fetch(path, {
    method: "GET",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Fetch request failed");
  }

  return await response.json();
};

export const postUser = async (event : eventObjectProps) => {
  const response = await fetch(postUserUrl, {
    method: "POST",
    credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Post request failed");
  }

  return await response.json();
};
