import { useState } from "react";

interface SearchBoxProps {
  value: string;
  onSearch: (keyword: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const [input, setInput] = useState(value);

  return (
    <form className="search-form" onSubmit={(event) => { event.preventDefault(); onSearch(input.trim()); }}>
      <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tim theo ten mon hoc" aria-label="Tim mon hoc" />
      <button className="btn" type="submit">Tim kiem</button>
    </form>
  );
}
