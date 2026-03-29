import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Contact {
    name: string;
    phoneNumber: string;
}
export interface backendInterface {
    addContact(name: string, phoneNumber: string): Promise<void>;
    deleteContact(name: string): Promise<void>;
    getAllContacts(): Promise<Array<Contact>>;
    getContactByName(name: string): Promise<Contact>;
}
