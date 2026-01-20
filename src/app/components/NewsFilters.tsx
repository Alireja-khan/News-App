import { Dispatch, SetStateAction, useState } from "react";

interface FiltersProps {
  country: string;
  setCountry: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  from: string;
  setFrom: Dispatch<SetStateAction<string>>;
  to: string;
  setTo: Dispatch<SetStateAction<string>>;
}

export default function NewsFilters({
  country, setCountry,
  category, setCategory,
  language, setLanguage,
  from, setFrom,
  to, setTo,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      <select value={country} onChange={(e) => setCountry(e.target.value)} className="border rounded px-2 py-1">
        <option value="us">USA</option>
        <option value="in">India</option>
        <option value="bd">Bangladesh</option>
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-2 py-1">
        <option value="">All Categories</option>
        <option value="business">Business</option>
        <option value="technology">Tech</option>
        <option value="sports">Sports</option>
      </select>

      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded px-2 py-1">
        <option value="en">English</option>
        <option value="bn">Bengali</option>
      </select>

      <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1"/>
      <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1"/>
    </div>
  );
}
