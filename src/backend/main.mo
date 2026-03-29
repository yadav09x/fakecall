import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type Contact = {
    name : Text;
    phoneNumber : Text;
  };

  module Contact {
    public func compare(contact1 : Contact, contact2 : Contact) : Order.Order {
      switch (Text.compare(contact1.name, contact2.name)) {
        case (#equal) { Text.compare(contact1.phoneNumber, contact2.phoneNumber) };
        case (order) { order };
      };
    };
  };

  let contacts = Map.empty<Text, Contact>();

  public shared ({ caller }) func addContact(name : Text, phoneNumber : Text) : async () {
    if (contacts.containsKey(name)) {
      Runtime.trap("Contact with this name already exists");
    };
    let contact : Contact = {
      name;
      phoneNumber;
    };
    contacts.add(name, contact);
  };

  public shared ({ caller }) func deleteContact(name : Text) : async () {
    if (not contacts.containsKey(name)) {
      Runtime.trap("No contact found with this name");
    };
    contacts.remove(name);
  };

  public query ({ caller }) func getAllContacts() : async [Contact] {
    contacts.values().toArray().sort();
  };

  public query ({ caller }) func getContactByName(name : Text) : async Contact {
    switch (contacts.get(name)) {
      case (null) { Runtime.trap("Contact not found") };
      case (?contact) { contact };
    };
  };
};
