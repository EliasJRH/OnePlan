/**
* Validation code for field timeEnd on event
* @param {import("gadget-server").EventTimeEndFieldValidationContext} context - All the useful bits for running this validation.
*/
export default async ({ record, errors }) => {
  const now = new Date();
  
  if (record.timeStart) {
    const startDate = new Date(record.timeStart);
    if (startDate < now) {
      errors.add("timeStart", "Event start time must be in the future");
    }
  }
  
  if (record.timeStart && record.timeEnd) {
    if (new Date(record.timeEnd) <= new Date(record.timeStart)) {
      errors.add("timeEnd", "Event end time must be after the start time");
    }
  }
};
