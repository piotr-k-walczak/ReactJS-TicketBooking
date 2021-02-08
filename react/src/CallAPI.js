import React from "react";
import Config from "./Config";

const path = (addons) => {
  return Config.path + "" + addons;
};

function requestOptions(params) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
}

function Call(url, params = {}) {
  return fetch(url, requestOptions(params)).then((res) => {
    return res.json();
  });
}

export function GetUserDetails(userId) {
  return Call(path("/userDetails"), { userId: userId });
}

export function GetActiveEvents() {
  return Call(path("/events"));
}

export function GetPastEvents() {
  return Call(path("/pastEvents"));
}

export function GetEventDetails(eventId) {
  return Call(path("/events"), { eventId: eventId });
}

export function GetTicketDetails(ticketId) {
  return Call(path("/tickets"), { ticketId: ticketId });
}

export function GetTicketsForEvent(eventId) {
  return Call(path("/tickets"), { eventId: eventId });
}

export function GetUserTickets(userId) {
  return Call(path("/userTickets"), { userId: userId });
}

export function GetUserTicketDetails(userId, ticketId) {
  return Call(path("/userTickets"), { userId: userId, ticketId: ticketId });
}

export function CancelTicket(userId, ticketId) {
  return Call(path("/cancelTicket"), { userId: userId, ticketId: ticketId });
}

export function CreateNewUser(userId, name, lastName, birthdate) {
  return Call(path("/newUser"), {
    userId: userId,
    name: name,
    lastName: lastName,
    birthdate: birthdate,
  });
}

export function CreateNewCorporateUser(
  userId,
  name,
  lastName,
  birthdate,
  companyName
) {
  return Call(path("/newCorporateUser"), {
    userId: userId,
    name: name,
    lastName: lastName,
    birthdate: birthdate,
    companyName,
    companyName,
  });
}

export function PurchaseTicket(userId, ticketId, count) {
  return Call(path("/purchaseTicket"), {
    userId: userId,
    ticketId: ticketId,
    count: count,
  });
}

export function PurchaseTickets(userId, orderedTickets) {
  return Call(path("/purchaseTickets"), {
    userId: userId,
    orderedTickets: orderedTickets,
  });
}

export function GetHostsActiveEvents(userId) {
  return Call(path("/host/events"), {
    userId: userId,
  });
}

export function GetHostsPastEvents(userId) {
  return Call(path("/host/pastEvents"), {
    userId: userId,
  });
}

export function GetHostsEventDetails(eventId) {
  return GetEventDetails(eventId);
}

export function GetSalesForEvent(userId, eventId) {
  return Call(path("/host/sales"), {
    userId: userId,
    eventId: eventId,
  });
}

export function GetSalesSummaryForEvent(userId, eventId) {
  return Call(path("/host/salesSummary"), {
    userId: userId,
    eventId: eventId,
  });
}

export function AddNewEvent(
  userId,
  eventName,
  eventDescription,
  imageUrl,
  eventStart,
  eventEnd,
  address,
  city,
  country
) {
  return Call(path("/host/addEvent"), {
    userId: userId,
    eventName: eventName,
    eventDescription: eventDescription,
    imageUrl: imageUrl,
    eventStart: eventStart,
    eventEnd: eventEnd,
    address: address,
    city: city,
    country: country,
  });
}

export function AddNewEventWithTickets(
  userId,
  eventName,
  eventDescription,
  imageUrl,
  eventStart,
  eventEnd,
  address,
  city,
  country,
  tickets
) {
  return Call(path("/host/addEventWithTickets"), {
    userId: userId,
    eventName: eventName,
    eventDescription: eventDescription,
    imageUrl: imageUrl,
    eventStart: eventStart,
    eventEnd: eventEnd,
    address: address,
    city: city,
    country: country,
    tickets: tickets,
  });
}

export function IsHost(userId) {
  return Call(path("/isHost"), {
    userId: userId,
  });
}

export default Call;
