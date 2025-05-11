// Enabling dynamic rendering for this route
export const dynamic = "force-dynamic";

// Importing necessary modules and libraries
import bcrypt from "bcryptjs"; // For hashing passwords
import { NextResponse } from "next/server"; // For handling server responses
import User from "@/model/user"; // User model for database operations
import { connectionWithDB } from "@/lib/mongodb"; // Function to establish a database connection

// POST handler for user signup
export async function POST(request: Request) {
    // Extracting data from the request body
    const { name, email, password, organization, agreeToTerms } = await request.json();

    // Helper function to validate email format
    const isValidMail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
        return regex.test(email);
    };

    // Validating required fields
    if (!name || !email || !password || !organization || agreeToTerms == false) {
        return NextResponse.json(
            {
                message: "Fill all fields", // Error message for missing fields
            },
            { status: 400 } // HTTP status code for bad request
        );
    }

    // Validating email format
    if (!isValidMail(email)) {
        return NextResponse.json(
            {
                message: "Invalid Email", // Error message for invalid email
            },
            {
                status: 400, // HTTP status code for bad request
            }
        );
    }

    try {
        // Establishing a connection with the database
        await connectionWithDB();

        // Checking if a user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: "User already exist", // Error message for duplicate user
                },
                {
                    status: 400, // HTTP status code for bad request
                }
            );
        }

        // Hashing the user's password for secure storage
        const hashPassword = await bcrypt.hash(password, 5);

        // Creating a new user in the database
        await User.create({
            name: name,
            email: email,
            organization: organization,
            password: hashPassword,
            agreeToTerms: agreeToTerms,
        });

        // Returning a success response
        return NextResponse.json(
            {
                message: "User created", // Success message
            },
            {
                status: 201, // HTTP status code for resource creation
            }
        );
    } catch (e) {
        // Handling any errors that occur during the process
        return NextResponse.json({
            message: "Something went wrong", // Generic error message
        });
    }
}