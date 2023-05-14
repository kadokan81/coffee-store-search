export interface CoffeeShopsMainResponse {
	results: CoffeeShopsResult[];
}

export interface CoffeeShopsResult {
	fsq_id: string;
	categories: Category[];
	chains: Chain[];
	distance: number;
	geocodes: Geocoder;
	link: string;
	location: Location;
	name: string;
	related_places: RelatedPlaces;
	timezone: string;
	imgUrl: string;
}

export interface Category {
	id: number;
	name: string;
	icon: Icon;
}

export interface Icon {
	prefix: string;
	suffix: string;
}

export interface Chain {
	id: string;
	name: string;
}

export interface Geocoder {
	main: Main;
	roof: Roof;
}

export interface Main {
	latitude: number;
	longitude: number;
}

export interface Roof {
	latitude: number;
	longitude: number;
}

export interface Location {
	address: string;
	address_extended?: string;
	census_block: string;
	country: string;
	cross_street: string;
	dma: string;
	formatted_address: string;
	locality: string;
	neighborhood: string[];
	postcode: string;
	region: string;
}

export interface RelatedPlaces {
	parent?: Parent;
}

export interface Parent {
	fsq_id: string;
	name: string;
}

export interface Context {
	geo_bounds: GeoBounds;
}

export interface GeoBounds {
	circle: Circle;
}

export interface Circle {
	center: Center;
	radius: number;
}

export interface Center {
	latitude: number;
	longitude: number;
}
