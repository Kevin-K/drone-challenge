# Drone Delivery Challenge

An implementation of the Walmart Labs Drone Delivery Challenge assignment.

## Terminology

- **Order Placed**: A placed order is the record of a order arriving in the system, this does not mean the order has or is being delivered, but that it needs to be **processed**.
- **Order Processed**: A processed order is an order that has been interpreted by the warehouse, and can be placed in the delivery schedule.
- **Out for Delivery**: An order acheives the "Out for Delivery" status when a drone has left the warehouse with the packaged order.
- **Delivered**: An order acheives the "Delivered" status when a drone has placed the packaged order at the requested delivery location.

## Assumptions

### Order Processing

- The order "time to delivery" time tracking begins when an order acheives the **Order Processed** status.
  - Orders made between 6am and 10pm instantainously move to **Order Processed**.
  - Orders placed outside of 6am and 10pm are instantainiously moved to **Order Processed** at 6am the next day.
  - The "time to delivery" time tracking is paused from 10pm to 6am, as it is reasonable to expect customers not to be deterred by the 8 hour offline period.

### Drone Limitations

- A drone is not restricted to traveling north, south, east, or west. It can travel northeast, northwest, southeast, southwest as well, while adhering to the ground speed of 1 vertical square per minute.
- A drone has a limited battery life and requires recharging or battery replacment after a fixed amount of flight time. **For this exercise it is assumed the battery capacity is great enough to support a flight time of 16 hours.**
- There is some amount of overhead to prepare orders at the warehouse, this includes packaging and placing the order in a "pickup" location for the drone. This means there may be overhead time where the drone must wait for the delivery payload. **For this exercise it is assumed the order is instantainiously packaged and placed for the drone to pick up when the order is processed.**

## Installation

```
npm install
```

## Running

```
npm start -- <input_file>
```
