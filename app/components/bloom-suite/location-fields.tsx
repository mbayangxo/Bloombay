"use client";

import {
  CITY_OTHER,
  COUNTRIES,
  getCities,
  getRegions,
  hasRegionList,
} from "./location-data";

export interface LocationValue {
  country: string;
  state: string;
  city: string;
  cityCustom: string;
}

export const EMPTY_LOCATION: LocationValue = {
  country: "",
  state: "",
  city: "",
  cityCustom: "",
};

export function LocationFields({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
}) {
  const regions = value.country ? getRegions(value.country) : [];
  const useRegionSelect = hasRegionList(value.country);
  const cities = value.country ? getCities(value.country, value.state) : [];
  const cityIsOther = value.city === CITY_OTHER;

  const set = (patch: Partial<LocationValue>) => onChange({ ...value, ...patch });

  return (
    <div className="bb-location">
      <label className="bb-field">
        <span className="bb-field__label">Country</span>
        <select
          className="bb-field__input bb-field__select bb-location__select"
          value={value.country}
          onChange={(e) =>
            set({ country: e.target.value, state: "", city: "", cityCustom: "" })
          }
        >
          <option value="">Select your country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {value.country && (
        useRegionSelect ? (
          <label className="bb-field">
            <span className="bb-field__label">State / Province / Region</span>
            <select
              className="bb-field__input bb-field__select bb-location__select"
              value={value.state}
              onChange={(e) => set({ state: e.target.value, city: "", cityCustom: "" })}
            >
              <option value="">Select state or region</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="bb-field">
            <span className="bb-field__label">State / Province / Region</span>
            <input
              type="text"
              className="bb-field__input"
              value={value.state}
              onChange={(e) => set({ state: e.target.value })}
              placeholder="e.g. Ontario, Bavaria, Gauteng"
            />
          </label>
        )
      )}

      {value.country && (useRegionSelect ? value.state : true) && (
        <>
          <label className="bb-field">
            <span className="bb-field__label">City</span>
            <select
              className="bb-field__input bb-field__select bb-location__select"
              value={value.city}
              onChange={(e) =>
                set({
                  city: e.target.value,
                  cityCustom: e.target.value === CITY_OTHER ? value.cityCustom : "",
                })
              }
            >
              <option value="">Select your city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === CITY_OTHER ? "Other — type my city below" : c}
                </option>
              ))}
            </select>
          </label>
          {cityIsOther && (
            <label className="bb-field">
              <span className="bb-field__label">Your city</span>
              <input
                type="text"
                className="bb-field__input"
                value={value.cityCustom}
                onChange={(e) => set({ cityCustom: e.target.value })}
                placeholder="Type your city"
              />
            </label>
          )}
        </>
      )}
    </div>
  );
}
