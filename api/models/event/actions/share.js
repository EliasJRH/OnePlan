import { assert, ActionOptions, Config } from "gadget-server";
 
/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, session }) => {
  // Validate user is signed in
  assert(session?.get("user"), "Must be signed in to share events");

  // Validate emails parameter
  assert(Array.isArray(params.emails), "emails parameter must be an array");
  assert(params.emails.length > 0, "emails parameter cannot be empty");

  logger.info({ emails: params.emails }, "Starting to share event with users");

  // Find users matching the provided emails
  const users = await api.user.findMany({
    filter: {
      email: {
        in: params.emails
      }
    },
    select: { 
      _all: true,
      email: true,
      firstName: true,
      lastName: true,
      id: true
    }
  });

  const results = {
    successful: [],
    failed: []
  };
  
  // Fetch full event details for email
  const event = await api.event.findOne(record.id, {
    select: {
      name: true,
      timeStart: true, 
      timeEnd: true,
      location: true,
      description: true
    }
  });

  // Create shares for each found user 
  for (const user of users) {
    try {
      // Create the share record
      await api.eventShares.create({
        event: { _link: record.id },
        user: { _link: user.id }
      });

      results.successful.push(user.email);
    } catch (error) {
      logger.error({ error, email: user.email }, "Failed to create event share");
      results.failed.push({ email: user.email, error: error.message });
    }
  }  const foundEmails = new Set(users.map(u => u.email));  params.emails.forEach(email => {
    if (!foundEmails.has(email)) {
      results.failed.push({ email, error: "User not found" });
    }
  });

  return results;
};

/** @type { ActionOnSuccess } */
export const onSuccess = async ({ params, record, api, emails, logger }) => {
  // Skip if no successful shares
  if (!params.emails || params.emails.length === 0) return;

  // Fetch event details for email
  const event = await api.event.findOne(record.id, {
    select: {
      name: true,
      timeStart: true,
      timeEnd: true,
      location: true,
      description: true
    }
  });

  // Find all successful users
  const users = await api.user.findMany({
    filter: {
      email: {
        in: params.emails
      }
    }
  });

  // Send emails to all successful shares
  for (const user of users) {
    const timeStart = new Date(event.timeStart).toLocaleString();
    const timeEnd = new Date(event.timeEnd).toLocaleString();
    
    const eventUrl = `https://oneplan--development.gadget.app/event-details?id=${record.id}`;
    logger.info(eventUrl);

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>You've been invited to an event!</h2>
        <p>Hi ${user.firstName || user.email},</p>
        <p>You've been invited to attend ${event.name}.</p>
        <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px;">  
          <p><strong>When:</strong> ${timeStart} - ${timeEnd}</p>
          <p><strong>Where:</strong> ${event.location}</p>
          ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="border-radius: 4px; background-color: #0066cc;">
                    <a href="${eventUrl}" style="padding: 12px 24px; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; border-radius: 4px; display: inline-block;">
                      View Event Details
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    await emails.sendMail({
      to: user.email,
      subject: `You're invited to ${event.name}`,
      html: emailTemplate
    });
  }
};

export const params = {
  emails: {
    type: "array",
    items: {
      type: "string"
    }
  }
};

export const options = {
  actionType: "custom",
  triggers: {
    api: true
  }
};
