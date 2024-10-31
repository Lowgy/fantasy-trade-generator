# Fantasy Football Trade Generator

A dynamic tool for fantasy football enthusiasts to generate trade proposals tailored to their league's player data and user preferences. The goal is to facilitate trade suggestions that align with users' specific needs, such as strengthening certain positions.

### Current Status: 🚧 Ongoing Development 🚧

This project is actively under development.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)


---

## Overview

The **Fantasy Football Trade Generator** allows users to:
- Connect their Sleeper fantasy football account.
- Sync league data to retrieve information on teams, rosters, and players.
- Generate trade proposals based on the user’s specified position needs and team deficiencies.

This application is designed to streamline the trade process, enabling users to explore possible trade options and simulate proposals before making decisions within their fantasy leagues.

## Features

### Currently Implemented
- **Sleeper Account Connection**: Users can link their Sleeper account and sync their league data.
- **League and Roster Syncing**: Upon connecting an account, the tool retrieves and stores roster data for all teams in the league.
- **Trade Proposal Generation**: Users can input position preferences, and the generator will suggest trades with other teams in the league.

### In Progress
- **Player Valuation**: Determining player values to make more balanced trade proposals.
- **UI Enhancements**: Improving the front-end for a smoother user experience.

## Tech Stack

- **Frontend**: Next.js, Axios for HTTP requests.
- **Backend**: PostgreSQL, Prisma ORM.
- **APIs**: 
  - Sleeper API for fantasy league data.
  - Custom endpoints for trade generation and user account management.
- **Deployment**: Vercel for hosting.
