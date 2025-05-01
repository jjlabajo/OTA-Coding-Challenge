# OTA Coding Challenge 🚀

Welcome to the OTA Coding Challenge project! This application consists of a Laravel backend API and a Next.js frontend, containerized using Docker for easy setup and development.

## ✨ Tech Stack

* **Backend:** Laravel 11 (PHP)
* **Frontend:** Next.js (React, TypeScript)
* **Styling:** Tailwind CSS
* **Database:** MySQL 8.0
* **Containerization:** Docker & Docker Compose

## 📋 Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your system (Mac, Windows, or Linux).

## ⚙️ Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd OTA-Coding-Challenge
    ```

2.  **Create Root Environment File:**
    * Create a new file named `.env` in the project root (`OTA-Coding-Challenge/.env`).
    * Populate it with the necessary database credentials. These are used by Docker Compose to set up the database container and pass credentials to the Laravel container.
    ```env
    # OTA-Coding-Challenge/.env

    # --- Database Credentials ---
    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=ota_challenge_db # Choose your database name
    DB_USERNAME=ota_user         # Choose your database username
    DB_PASSWORD=secret           # Choose a strong password
    DB_ROOT_PASSWORD=root_secret # Choose a strong root password

    ```
    * **Note:** Ensure the `backend/.env` file also exists (Laravel needs it). You can copy `backend/.env.example` to `backend/.env` if needed. The `APP_KEY` must be set either in the root `.env` (passed by Docker Compose) or directly in `backend/.env`. If it's not set in either, generate one using the command in the "Backend Commands" section below *after* starting the containers.

3.  **Create Frontend Root Environment File:**
    * Create a new file named `.env.development.local` in the project root (`OTA-Coding-Challenge/frontend/.env`).
    ```env
    # OTA-Coding-Challenge/frontend/.env

    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    NEXT_PUBLIC_EXTERNAL_API_URL=https://mrge-group-gmbh.jobs.personio.de

    ```

4.  **Build and Start Containers:**
    * Open your terminal in the project root (`OTA-Coding-Challenge`).
    * Run the following command to build the images (if they don't exist or need updating) and start the services in detached mode:
    ```bash
    docker-compose up -d --build
    ```



## 🚀 Running the Application

* **Frontend:** Access the Next.js application in your browser at [http://localhost:3000](http://localhost:3000)
* **Backend API:** The Laravel API is accessible at [http://localhost:8000](http://localhost:8000). (You typically interact with this via the frontend or API tools like Postman).

## 🐳 Common Docker Commands

*(Run these from the project root directory)*

* **Start Services:** `docker-compose up -d` (Starts containers in the background)
* **Stop Services:** `docker-compose down` (Stops and removes containers, network)
* **Rebuild & Start:** `docker-compose up -d --build` (Rebuilds images and starts services)
* **Restart a Service:** `docker-compose restart <service_name>` (e.g., `backend`, `frontend`, `db`)
* **View Logs:** `docker-compose logs <service_name>` (e.g., `backend`, `frontend`)
* **View Logs (Live):** `docker-compose logs -f <service_name>` (Follows log output)
* **Execute Command in Container:** `docker-compose exec <service_name> <command>` (e.g., `docker-compose exec backend bash`)

## 🐘 Backend Commands (Laravel Artisan)

*(Execute these using `docker-compose exec backend ...`)*

* **Run Migrations:** `php artisan migrate`
* **Rollback Last Migration:** `php artisan migrate:rollback`
* **Migration Status:** `php artisan migrate:status`
* **Run Seeders:** `php artisan db:seed` (Use `--class=YourSeeder` for specific ones)
* **Clear Cache:** `php artisan cache:clear`
* **Clear Config Cache:** `php artisan config:clear`
* **Clear Route Cache:** `php artisan route:clear`
* **Run Tinker (REPL):** `php artisan tinker`
* **Run Tests:** `php artisan test`
* **Generate App Key (if missing):** `php artisan key:generate`

## 💾 Database Access

* **Connect via Command Line:**
    ```bash
    docker-compose exec db mysql -u <your_db_username> -p <your_db_database>
    ```
    * Replace `<your_db_username>` and `<your_db_database>` with the values from your root `.env`.
    * It will prompt for the password (`DB_PASSWORD` from root `.env`).

* **Run a Specific Query via Command Line:**
    ```bash
    # Example: Select all from job_posts
    docker-compose exec db mysql -u ota_challenge_user -p <your_db_username> <your_db_database> -e "SELECT * FROM job_posts;"
    ```
    * Replace placeholders with values from your root `.env`.
    * **Warning:** Putting the password directly in the command (`-p'password'`) can be a security risk as it might be stored in your shell history. Use the interactive method above (`-p` without the password) for better security.

---

Happy Coding! 🎉
