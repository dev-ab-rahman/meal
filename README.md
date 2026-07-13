# 🍽️ Meal Tracker App – Project Overview

## Introduction

Meal Tracker is a simple mobile application designed for people who eat regularly at a hotel, mess, hostel, or cafeteria and want to maintain their own accurate meal records.

In many hotels or messes, meal counts are recorded manually by the manager. Sometimes meals are mistakenly counted even when a person has informed the manager that they would not eat. This can lead to incorrect monthly bills and unnecessary expenses.

The goal of this application is to provide users with a reliable personal meal record so they can easily verify their monthly bill and know exactly how many meals they have consumed.

---

# Problem Statement

Currently, users rely entirely on the hotel or mess manager to keep track of meals.

Common problems include:

* Meals are sometimes counted by mistake.
* Users forget whether they ate on a particular day.
* There is no personal record to compare with the manager's records.
* Monthly meal costs are difficult to verify manually.

This application solves these problems by allowing users to record every meal themselves.

---

# Target Users

The application is intended for:

* Students living in hostels or messes
* Employees who eat at a regular hotel
* Paying guest (PG) residents
* Anyone who pays for meals on a per-meal basis

---

# Core Concept

Each day contains three meal slots:

* Breakfast
* Lunch
* Dinner

The user simply marks the meals they actually ate.

The application automatically:

* Saves the meal record.
* Calculates the total meals.
* Calculates the monthly expense.
* Preserves the month's history.

When a new month begins, a new tracker is created automatically while all previous months remain available in history.

---

# Main Features

## 1. Dashboard

The home screen provides a quick overview of the current month.

It displays:

* Today's date
* Today's meal status
* Total meals this month
* Total expense
* Current meal price

---

## 2. Monthly Meal Tracker

This is the primary feature of the application.

A table is automatically generated for the current month.

Each row represents one day.

Each day includes:

* Breakfast
* Lunch
* Dinner

The user taps to mark meals as eaten.

Changes are saved instantly.

The application automatically calculates:

* Meals per day
* Total monthly meals

---

## 3. Cost Calculation

Every meal has a configurable price.

Default:

* Meal Price = ৳55

The application automatically calculates:

Total Cost = Total Meals × Meal Price

The cost summary updates immediately whenever meal records change.

---

## 4. Monthly History

Every month's data is permanently stored.

Users can:

* View previous months
* Review meal records
* View total meals
* View total expenses

No historical data is lost when a new month begins.

---

## 5. Settings

Users can customize:

* Meal price
* Theme (Light/Dark)
* Export preferences
* Backup and restore options (future)

---

# User Flow

Open App

↓

Dashboard

↓

Monthly Tracker

↓

Mark Today's Meals

↓

Meals Saved Automatically

↓

Cost Updated Automatically

↓

Monthly Summary Updated

↓

History Available Forever

---

# Data Structure

Each day stores:

* Date
* Breakfast status
* Lunch status
* Dinner status
* Daily meal count

Each month stores:

* Month
* Year
* Total meals
* Total cost

---

# Business Rules

* A day can contain a maximum of three meals.
* Meal count is calculated automatically.
* Total expense is calculated automatically.
* A new month is generated automatically.
* Previous months become read-only history unless edited by the user.
* All calculations happen locally on the device.

---

# Technology Stack

Frontend

* React Native
* Expo
* Expo Router
* TypeScript
* NativeWind

Local Storage

* SQLite
* AsyncStorage (for app settings)

Animations

* Moti
* React Native Reanimated

---

# Future Enhancements

* Daily reminders
* Notes for each day
* Export as PDF
* Export as CSV
* Charts and statistics
* Multiple hotel/mess support
* Cloud backup
* Home screen widget
* Search by date
* PIN/Biometric lock

---

# Project Goal

The purpose of this project is not just to record meals.

It aims to provide users with an accurate, trustworthy, and easy-to-use personal meal management system that helps eliminate billing mistakes, simplifies monthly expense tracking, and gives complete confidence in their meal records.
