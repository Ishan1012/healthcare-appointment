import { Router, Request, Response } from "express";
import { CalendarService } from "../service/CalendarService";

const router = Router();
const calendarService = new CalendarService();

router.get("/auth", (req: Request, res: Response) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
        return res.status(400).send("User ID is required to authenticate Google Calendar");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        return res.status(400).send("GOOGLE_CLIENT_ID is not configured in .env");
    }

    const authUrl = calendarService.getAuthUrl(userId);
    res.redirect(authUrl);
});

router.get("/callback", async (req: Request, res: Response) => {
    const { code, state } = req.query;
    if (!code || typeof code !== "string") {
        return res.status(400).send("Authorization code is missing");
    }
    if (!state || typeof state !== "string") {
        return res.status(400).send("User ID state parameter is missing");
    }

    try {
        const success = await calendarService.handleOAuthCallback(code, state);

        if (!success) {
            return res.status(500).send("Failed to save Google Calendar credentials to database");
        }

        res.send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 100px; padding: 20px;">
                <h1 style="color: #059669;">WellNest Google Calendar Authorized!</h1>
                <p style="color: #374151; font-size: 16px;">Your Google Calendar has been successfully connected to your account.</p>
                <p style="color: #6b7280; font-size: 14px;">You can now close this tab and proceed back to the dashboard.</p>
            </div>
        `);
    } catch (error: any) {
        console.error("Error in calendar authorization callback:", error.message);
        res.status(500).send("Authentication failed: " + error.message);
    }
});

export default router;
