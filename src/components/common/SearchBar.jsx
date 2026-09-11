import Input from "./Input";

export default function SearchBar({ value, onChange, placeholder = "Search…", className }) {
  return (
    <div className={className}>
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  );
}