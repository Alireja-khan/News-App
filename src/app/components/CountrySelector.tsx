import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { newsSourceApiResponse } from '@/types/news';
import React, { useEffect, useState } from 'react';


interface countrySelectorProps {
    country: string;
    setCountry: (country: string) => void;
}

interface countryOption {
    code: string;
    name: string;
}

export default function CountrySelector({ country, setCountry }: countrySelectorProps) {

    const [countries, setCountries] = React.useState<countryOption[]>([]);
    const [loading, setLoding] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch(
                    "https://newsapi.org/v2/top-headlines/sources?apiKey=e7073154b5144b5a812f137aa5d67180"
                );
                const data: newsSourceApiResponse = await res.json();

                const uniqueCountries: { [key: string]: string } = {};
                data.sources.forEach((source) => {
                    if (!uniqueCountries[source.country]) {
                        uniqueCountries[source.country] = source.country.toUpperCase();
                    }
                });

                const countryOptions: countryOption[] = Object.keys(uniqueCountries).map((code) => ({
                    code,
                    name: uniqueCountries[code],
                })
                );
                setCountries(countryOptions);
                setLoding(false);
            }
            catch (error){
                console.error("Error fetching countries:", error);
                setLoding(false);
            }
        };

        fetchCountries();
    }, []);

    if (loading) return <p>Loading countries...</p>;

    return (
        <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
                <SelectValue placeholder="Select a country"/>
            </SelectTrigger>
            <SelectContent>
                {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                        {c.name}
                    </SelectItem>
                ))}
            </SelectContent>

        </Select>
    );
};