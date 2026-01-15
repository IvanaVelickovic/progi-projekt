interface Location {
    lat: number;
    lng: number;
}

interface AddressComponent {
    country: string;
    city: string;
    postcode: string;
    street: string;
}

interface AdditionalReverseGeoencodingInformation {
    country_code: string;
    suburb: string;
    distance: number;
    state: string;
}

interface ReverseGeoencodingResponse {
    location: Location;
    address: string;
    formatted_address: string;
    address_components: AddressComponent;
    additional_information: AdditionalReverseGeoencodingInformation;
}

export type { ReverseGeoencodingResponse }