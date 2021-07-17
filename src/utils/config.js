import useSwr from "swr";

const useConfig = () => {
  const { data, error } = useSwr("/config.json", config);

  return {
    config: data,
    isLoading: !error && !data,
    error: error
  }
}

const config = () => fetch("/config.json").then((response) => response.json());

export { config, useConfig };
