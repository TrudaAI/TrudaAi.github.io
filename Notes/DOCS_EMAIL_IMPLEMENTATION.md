# IMS Email Approval System: Architectural & Implementation Notes

## 1. Overview & Constraints
* **Context:** Internal Management System (IMS) for high-priority operational workflows requiring up-the-chain approvals.
* **Environment:** On-premises factory network (VLAN) or secure VPN tunnel managed by Numata. Completely private, with no public internet-facing ingress.
* **Cost Requirement:** Zero additional software licensing fees. Leverages existing corporate Microsoft 365 / Outlook infrastructure.
* **Security Guardrail:** React frontend must *never* hold long-lived application secrets or tenant-wide credentials. All sensitive communication to the outside world is brokered through an outbound-only relay.

---

## 2. Recommended Architecture
To minimize front-end token expiration issues and satisfy enterprise security audits, we utilize a **Two-Tier Local Architecture** with an outbound-only internet link to Microsoft Graph API.

              INTERNAL FACTORY NETWORK (VLAN/VPN)
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   ┌──────────────────┐  (Internal JSON POST)  ┌────────────────────┐   │
│   │  React Frontend  │───────────────────────>│  Node.js Backend   │   │
│   │   (Local Host)   │                        │ (VLAN/On-Prem Server) │
│   └──────────────────┘                        └────────────────────┘   │
│                                                          │             │
└──────────────────────────────────────────────────────────┼─────────────┘
│
(Outbound HTTPS Only)   ▼
┌────────────────────┐
│ Cloud Services     │
│ MS Graph API       │
└────────────────────┘
│
▼
[Manager's Outlook Inbox]


### Key Technical Properties:
1. **No Inbound Open Ports:** The on-prem factory server hosting the IMS app requires absolutely **zero** inbound ports open to the public internet. 
2. **Outbound Handshake:** The local backend machine only requires outbound HTTPS access (Port 443) to target `https://graph.microsoft.com`.
3. **Dedicated Mailbox:** System-generated emails are sent using an Azure App Registration on behalf of a free corporate shared mailbox (e.g., `ims-alerts@trudafoods.co.za`).

---

## 3. IT Infrastructure Configuration (For Numata / Azure Admin)

To provision this in the corporate Microsoft 365 Tenant, request the following setup:

1. **Create Shared Mailbox:** * Name: `IMS Alerts`
   * Email: `ims-alerts@yourdomain.co.za` (Does not require a paid Exchange user license).
2. **App Registration:** Register a line-of-business app in the Azure Portal.
3. **API Permissions Required:**
   * Microsoft Graph -> Application Permissions -> `Mail.Send`
4. **Admin Consent:** Ensure the tenant global administrator clicks **"Grant admin consent for Truda Foods"** for the permission string.
5. **Credentials Secure Delivery:** Secure the generated `Tenant ID`, `Client ID`, and `Client Secret` values to be injected into the local backend production environment variables.

---

## 4. Implementation Templates

### A. Local Backend Relay (Node.js/Express Boilerplate)
Create an internal utility service running on your local server. It uses the official `@microsoft/microsoft-graph-client` and `@azure/msal-node` packages.

```javascript
// server.js
const express = require('express');
const { ConfidentialClientApplication } = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch'); // Required polyfill for Graph client

const app = express();
app.use(express.json());

// Environment Variables configured safely on local iron
const msalConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
    }
};

const tokenRequest = {
    scopes: ['[https://graph.microsoft.com/.default](https://graph.microsoft.com/.default)'],
};

const cca = new ConfidentialClientApplication(msalConfig);

// Dedicated route to process approval requests from React frontend
app.post('/api/notify-approval', async (req, res) => {
    try {
        const { targetManagerEmail, actionDetails, approvalLink } = req.body;

        // 1. Acquire Token via Client Credentials Flow (App Identity, no user interactive login required)
        const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);
        const accessToken = authResponse.accessToken;

        // 2. Initialize Microsoft Graph Client
        const graphClient = Client.init({
            authProvider: (done) => done(null, accessToken),
        });

        // 3. Construct Payload
        const emailPayload = {
            message: {
                subject: `URGENT: IMS System Action Approval Required`,
                body: {
                    contentType: 'HTML',
                    content: `
                        <h3>IMS Operational Action Pending Approval</h3>
                        <p><strong>Details:</strong> ${actionDetails}</p>
                        <p>An action has been flagged down the chain that requires your level of authority.</p>
                        <br/>
                        <a href="${approvalLink}" style="padding: 10px 20px; background-color: #0078d4; color: white; text-decoration: none; border-radius: 4px;">Open IMS Approval Dashboard</a>
                    `
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: targetManagerEmail
                        }
                    }
                ]
            }
        };

        // 4. Send via the shared system notification account
        await graphClient
            .api('/users/ims-alerts@yourdomain.co.za/sendMail')
            .post(emailPayload);

        return res.status(200).json({ success: true, message: 'Approval email dispatched successfully.' });
    } catch (error) {
        console.error('Graph API Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to process notification routing.' });
    }
});

app.listen(5000, () => console.log('IMS Local Security Relay active on port 5000'));
B. React Frontend Integration
Your UI code makes standard, isolated calls straight to your local asset backend.

TypeScript
// useApprovalNotification.ts (React Hook Example)
import { useState } from 'react';

interface NotificationPayload {
  targetManagerEmail: string;
  actionDetails: string;
  approvalLink: string;
}

export const useApprovalNotification = () => {
  const [isSending, setIsSending] = useState(false);

  const dispatchApprovalEmail = async (payload: NotificationPayload) => {
    setIsSending(true);
    try {
      // Points straight to your local VLAN backend service
      const response = await fetch('[http://192.168.](http://192.168.)x.x:5000/api/notify-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      console.log('Manager alerted successfully via Outlook API infrastructure');
    } catch (err) {
      console.error('Failed to dispatch notification:', err);
    } finally {
      setIsSending(false);
    }
  };

  return { dispatchApprovalEmail, isSending };
};
5. Development Tasks & Milestones
[ ] Finalize local static IP assignments or local domain configurations (.local) for the network interface card on the targeted host server.

[ ] Submit Azure App Registration manifest requirements specification sheet to Numata.

[ ] Implement secure storage profile mechanism (.env) on local system environment host config.

[ ] Formulate core HTML email display matrices to cleanly format operational variables inside the outlook desktop application context.