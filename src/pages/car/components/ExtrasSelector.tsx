import React from "react";

type Extras = {
    insurance: boolean;
    gps: boolean;
    childSeat: boolean;
};

type Props = {
    selected: Extras;
    onChange: (key: keyof Extras) => void;
};

const ExtrasSelector: React.FC<Props> = ({ selected, onChange }) => {
    return (
        <fieldset className="mt-6">
            <legend className="font-semibold mb-2">Choose Extras:</legend>
            <div className="flex flex-row items-center gap-6">
                <label className="flex items-center gap-2" htmlFor="extra-insurance">
                    <input id="extra-insurance" type="checkbox" checked={selected.insurance} onChange={() => onChange("insurance")} />
                    <span className="text-sm text-gray-700">Insurance</span>
                </label>

                <label className="flex items-center gap-2" htmlFor="extra-gps">
                    <input id="extra-gps" type="checkbox" checked={selected.gps} onChange={() => onChange("gps")} />
                    <span className="text-sm text-gray-700">GPS</span>
                </label>

                <label className="flex items-center gap-2" htmlFor="extra-childseat">
                    <input id="extra-childseat" type="checkbox" checked={selected.childSeat} onChange={() => onChange("childSeat")} />
                    <span className="text-sm text-gray-700">Child Seat</span>
                </label>
            </div>
        </fieldset>
    );
};

export default ExtrasSelector;
