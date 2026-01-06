# 🏨 Hotel Reservation System – AI Prompt (Markdown Version)

## PROMPT START

Create a **Hotel Reservation System** based on the functional flow provided in the reference diagram.

---

# 🏨 HOTEL RESERVATION SYSTEM – Functional Structure

---

## 1. Reservation Methods

Two main booking entry points:

- **Frontdesk Reservation**
- **Online Booking System**

Both connect to the central guest management workflow.

---

## 2. Guest Check-in & Check-out Process

A core module responsible for:

- Guest check-in  
- Guest check-out  
- Room assignment  
- Updating room availability  

This is the central process linking all sub-modules.

---

## 3. Sub-Processes Under Guest Processing

### a. Room Shifting
- Ability to transfer guests to a different room  
- Update room allocation  
- Prevent conflicts with bookings  

### b. Other Activities
- Extra guest services (e.g., spa, shuttle, amenities, special requests)  
- Log and add charges automatically  

### c. Billing Process
- Calculate total charges  
- Include room rates + additional services  
- Invoice generation  
- Process payment on checkout  

---

## 4. Housekeeping Integration

### Housekeeping Module:
- Manage cleaning tasks  
- Change room status to "Cleaning", "Occupied", etc.  

### Make Room Available:
- Trigger after housekeeping confirms the room is ready  
- Enables reservations for the room again  

---

## 5. Reporting Module

Generate hotel operational and analytic reports:

- Room occupancy reports  
- Revenue reports  
- Guest history  
- Daily audit logs  
- Room shift activity logs  
- Housekeeping performance reports  

---

# 🎨 UI/UX or System Architecture Guidelines

Follow the structure from the provided diagram:

1. Top section — Reservation modules  
2. Middle — Guest check-in/check-out  
3. Middle sub-section — Room shifting, activities, billing  
4. Lower — Housekeeping → Make Room Available  
5. Bottom — Reporting  

The system layout should visually follow this top-down flow.

---

# 📦 Expected Deliverables

### A. System Documentation
- Functional overview  
- Module breakdown  
- Optional: Mermaid or ASCII flowchart  

### B. Optional System Implementation
- API design  
- Database schema (rooms, reservations, guests, billing, housekeeping)  
- UI screens for each module  
- Check-in/check-out workflow logic  
- Reporting dashboard  

### C. Optional Advanced Features
- Calendar-based room availability  
- Notification/alert system  
- Automatic room assignment logic  
- Email/SMS confirmations  

---

## PROMPT END
