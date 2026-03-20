
# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product: E-Cell IIIT Trichy Website

## Version: v1.0

## Owner: E-Cell IIIT Trichy

## Date: March 2026

---

# 1. 🎯 Objective

To design and develop an official website for E-Cell IIIT Trichy that:

* Showcases the team and activities
* Highlights past and upcoming events
* Attracts sponsors and collaborators
* Builds credibility and online presence
* Serves as a central information hub

---

# 2. 👥 Target Users

### Primary Users:

* Students (IIIT Trichy & other colleges)
* Aspiring entrepreneurs
* Event participants

### Secondary Users:

* Sponsors & companies
* Speakers & mentors
* Alumni

---

# 3. 🚀 Key Goals

* Present E-Cell professionally
* Increase event participation
* Attract sponsorships
* Enable easy content updates (via admin panel)
* Build long-term digital presence

---

# 4. 📦 Scope (v1)

### Must-have Features:

- [x] Home page
- [x] About page
- [x] Team page
- [x] Alumni page
- [x] Events listing page
- [x] Event detail page
- [x] Sponsors page
- [x] Contact page

---

# 5. 🧱 Functional Requirements

---

## 5.1 Home Page

### Features:

- [x] Hero section with title & tagline
- [x] Short introduction to E-Cell
- [x] Featured events
- [x] Sponsors section
- [x] CTA buttons (Contact Us)

### Acceptance Criteria:

- [x] Loads within 2 seconds
- [x] Responsive across devices
- [x] CTA buttons redirect correctly

---

## 5.2 About Page

### Features:

- [x] Overview of E-Cell
- [x] Vision & mission
- [x] Activities conducted (Read Our Story)
- [x] Faculty advisor section

### Acceptance Criteria:

* Content editable via backend (optional)
- [x] Clean, readable layout

---

## 5.3 Team Page

### Features:

- [x] List of team members
- [x] Categories (Faculty Incharge, Overall Corrdinator, Members)
- [x] Each member includes:

  - [x] Name
  - [x] Role
  - [x] Photo
  - [x] LinkedIn profile

### Acceptance Criteria:

* Dynamic rendering from database
- [x] Grid layout (responsive)

---

## 5.4 Events Page

### Features:

- [x] List of events
- [x] Categorization:

  - [x] Upcoming events (must have a button participant now which students will fill the form to particpant in the event)
  - [x] Past events

Each event card includes:

- [x] Title
- [x] Date
- [x] Poster/image
- [x] Short description
- [x] “View Details” button

### Acceptance Criteria:

* Events fetched dynamically
- [x] Click redirects to event detail page

---

## 5.5 Event Detail Page

### Features:

- [x] Event banner/image
- [x] Title, date, venue
- [x] Full description
- [x] Speakers (optional)
- [x] Photo gallery
- [x] Highlights (attendance, impact)
- [x] Registration form (if event is upcoming)

### Acceptance Criteria:

- [x] Dynamic routing (`/events/:id`)
- [x] Image gallery supports multiple images
- [x] Proper fallback if no images

---

## 5.6 Sponsors Page

### Features:

- [x] Why sponsor E-Cell
- [x] Audience reach & benefits
- [x] CTA (Contact for sponsorship)

### Acceptance Criteria:

- [x] Clear CTA visible
- [x] Professional layout

---

## 5.7 Contact Page

### Features:

- [x] Email
- [x] Phone
- [x] Address
- [x] Contact form:

  - [x] Name
  - [x] Email
  - [x] Message

### Acceptance Criteria:

* Form submission works (backend API)
- [x] Validation implemented

---

# 6. 🧠 Non-Functional Requirements

### Performance:

- [x] Page load < 2 seconds
- [x] Optimized images

### Responsiveness:

- [x] Mobile-first design
- [x] Works on all screen sizes

### SEO:

- [x] Meta tags
- [x] Proper headings
- [x] Clean URLs

### Security:

* Input validation
* API protection (if admin panel exists)

---

# 7. 🏗️ Technical Requirements

### Frontend:

- [x] Next.js
- [x] Tailwind CSS

### Backend:

* Express.js

### Database:

* MongoDB

---

# 8. 🗄️ Database Schema (High-Level)

### events

* id
* title
* description
* date
* venue
* category (upcoming/past)
* main_image

---

### event_images

* id
* event_id
* image_path

---

### team_members

* id
* name
* role
* category
* image
* linkedin

---

### contact_messages

* id
* name
* email
* message

---

# 9. 🔧 Admin Panel (Future Scope but Recommended)

### Features:

* Add/edit/delete events
* Upload images
* Manage team members
* View contact messages

---

# 10. 📊 Success Metrics

* Number of website visitors
* Event registrations
* Sponsorship inquiries
* Engagement time

---

# 11. 🚧 Constraints

* Limited initial content
* Small team size
* Time constraints

---

# 12. 📅 Milestones

### Phase 1 

- [x] UI design
- [x] Basic pages setup

### Phase 2 

* Backend APIs
* Database integration

### Phase 3

* Testing
* Deployment

---

# 13. ⚠️ Risks

* Lack of content → use placeholders
* Low engagement initially
* Delay in backend integration

---

# ✅ Final Note

This PRD is designed for a **lean but scalable launch**.

👉 Focus on:

- [x] Clean UI
* Dynamic events
- [x] Strong sponsor page

Everything else can grow later.




# Login and Sign Up Page:

There are total 3 types of Users:

1) Super Admin: 
--> have the access to all admin panel
--> Add the feature of adding/updating/delteing/  new admins 

2) Admins
--> have the access to all admin panel except adding/updating/delteing/  new admins 

3) USer:
--> can view entire website and also send the contact inquiry without login, only login needed for particpants to register for events, 
--> also add the feature to show already register events to the user after login only



