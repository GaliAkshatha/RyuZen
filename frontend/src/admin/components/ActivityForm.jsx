import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldBuilder from "./FieldBuilder";

const API = import.meta.env.VITE_API_URL;

function ActivityForm({
  type,
  mode = "create",
  initialData = null,
  fetchActivities,
  setSelectedType,
}) {
  

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [fieldError, setFieldError] = useState("");

  const [requirementError, setRequirementError] =
    useState("");

  const [requirement, setRequirement] =
    useState("");

  const [field, setField] =
    useState({
      label: "",
      type: "text",
      required: false,
    });

  const [formData, setFormData] =
    useState(
      initialData || {

        title: "",
        description: "",

        points: "",
        penaltyPoints: "",

        startDate: "",
        endDate: "",

        type,

        formFields: [],

        venue: "",

        startTime: "",
        endTime: "",

        registrationDeadline: "",

        attendanceMethod: "manual",

        requirements: [],

        maxParticipants: "",

        instructions: "",

        submissionType: "pdf",

      }
    );

  function handleChange(e) {

    const { name, value } = e.target;

    setFormData({

      ...formData,

      [name]: value,

    });

    if (errors[name]) {

      setErrors({

        ...errors,

        [name]: "",

      });

    }

  }

  function addRequirement() {

    if (!requirement.trim()) {

      setRequirementError(
        "Requirement cannot be empty."
      );

      return;

    }

    const exists =
      formData.requirements.some(

        (r) =>

          r.toLowerCase() ===
          requirement.toLowerCase()

      );

    if (exists) {

      setRequirementError(
        "Requirement already added."
      );

      return;

    }

    setRequirementError("");

    setFormData({

      ...formData,

      requirements: [

        ...formData.requirements,

        requirement,

      ],

    });

    setRequirement("");

  }

  function addField() {

    if (!field.label.trim()) {

      setFieldError(
        "Field name is required."
      );

      return;

    }

    const exists =
      formData.formFields.some(

        (f) =>

          f.label.toLowerCase() ===
          field.label.toLowerCase()

      );

    if (exists) {

      setFieldError(
        "Field already exists."
      );

      return;

    }

    setFieldError("");

    setFormData({

      ...formData,

      formFields: [

        ...formData.formFields,

        field,

      ],

    });

    setField({

      label: "",

      type: "text",

      required: false,

    });

  }

  function validateForm() {

    const newErrors = {};

    // ---------- Common ----------

    if (!formData.title.trim())
      newErrors.title =
        "Title is required.";

    if (!formData.description.trim())
      newErrors.description =
        "Description is required.";

    if (formData.points === "")
      newErrors.points =
        "Reward points are required.";

    if (formData.penaltyPoints === "")
      newErrors.penaltyPoints =
        "Penalty points are required.";

    if (!formData.startDate)
      newErrors.startDate =
        "Start date is required.";

    if (!formData.endDate)
      newErrors.endDate =
        "End date is required.";

    if (

      formData.startDate &&
      formData.endDate &&

      new Date(formData.startDate) >
      new Date(formData.endDate)

    ) {

      newErrors.endDate =
        "End date must be after start date.";

    }

    // ---------- FORM ----------

    if (

      type === "form" &&

      formData.formFields.length === 0

    ) {

      newErrors.formFields =
        "Add at least one form field.";

    }

    // ---------- WORKSHOP ----------

    if (type === "workshop") {

      if (!formData.venue.trim())
        newErrors.venue =
          "Venue is required.";

      if (!formData.startTime)
        newErrors.startTime =
          "Start time is required.";

      if (!formData.endTime)
        newErrors.endTime =
          "End time is required.";

      if (

        formData.startTime &&
        formData.endTime &&
        formData.startTime >= formData.endTime

      ) {

        newErrors.endTime =
          "End time must be after start time.";

      }

      if (!formData.registrationDeadline)
        newErrors.registrationDeadline =
          "Registration deadline is required.";

      if (

        formData.registrationDeadline &&
        formData.startDate &&

        new Date(formData.registrationDeadline) >
        new Date(formData.startDate)

      ) {

        newErrors.registrationDeadline =
          "Registration must close before workshop starts.";

      }

      if (!formData.maxParticipants)
        newErrors.maxParticipants =
          "Maximum participants required.";

    }

    // ---------- ASSIGNMENT ----------

    if (type === "assignment") {

      if (!formData.instructions.trim())
        newErrors.instructions =
          "Instructions are required.";

    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );

  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (!validateForm()) {

      document

        .querySelector(".border-red-500")

        ?.scrollIntoView({

          behavior: "smooth",

          block: "center",

        });

      return;

    }

    try {

      setLoading(true);

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      const url =

        mode === "create"

          ? `${API}/activities`

          : `${API}/activities/${initialData._id}`;

      const method =

        mode === "create"

          ? "POST"

          : "PUT";

      const response =
        await fetch(url, {

          method,

          headers: {

            "Content-Type":
              "application/json",

          },

          body:
            JSON.stringify({

              ...formData,

              createdBy:
                user.id,

            }),

        });

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.message);

        return;

      }

      alert(

        mode === "create"

          ? "Activity Created"

          : "Activity Updated"

      );

      if (mode === "create") {

        setFormData({

          title: "",

          description: "",

          points: "",

          penaltyPoints: "",

          startDate: "",

          endDate: "",

          type,

          formFields: [],

          venue: "",

          startTime: "",

          endTime: "",

          registrationDeadline: "",

          attendanceMethod: "manual",

          requirements: [],

          maxParticipants: "",

          instructions: "",

          submissionType: "pdf",

        });

        setField({

          label: "",

          type: "text",

          required: false,

        });

        setRequirement("");

        setErrors({});

        setFieldError("");

        setRequirementError("");

        setSelectedType?.("");

      }

      if (mode === "edit") {

        navigate(
          `/admin/activities/${initialData._id}`
        );

      }

      fetchActivities?.();

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  }

    return (

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* ---------------- BASIC INFO ---------------- */}

      <div>

        <input
          type="text"
          name="title"
          placeholder="Activity Title"
          value={formData.title}
          onChange={handleChange}
          className={`
            w-full
            p-4
            rounded-2xl
            bg-white/5
            border
            ${
              errors.title
                ? "border-red-500"
                : "border-white/10"
            }
          `}
        />

        {
          errors.title && (

            <p className="text-red-400 text-sm mt-2">

              {errors.title}

            </p>

          )
        }

      </div>

      <div>

        <textarea
          name="description"
          rows="4"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className={`
            w-full
            p-4
            rounded-2xl
            bg-white/5
            border
            ${
              errors.description
                ? "border-red-500"
                : "border-white/10"
            }
          `}
        />

        {
          errors.description && (

            <p className="text-red-400 text-sm mt-2">

              {errors.description}

            </p>

          )
        }

      </div>

      <div className="grid grid-cols-2 gap-5">

        <div>

          <input
            type="number"
            name="points"
            placeholder="Reward Points"
            value={formData.points}
            onChange={handleChange}
            className={`
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border
              ${
                errors.points
                  ? "border-red-500"
                  : "border-white/10"
              }
            `}
          />

          {
            errors.points && (

              <p className="text-red-400 text-sm mt-2">

                {errors.points}

              </p>

            )
          }

        </div>

        <div>

          <input
            type="number"
            name="penaltyPoints"
            placeholder="Penalty Points"
            value={formData.penaltyPoints}
            onChange={handleChange}
            className={`
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border
              ${
                errors.penaltyPoints
                  ? "border-red-500"
                  : "border-white/10"
              }
            `}
          />

          {
            errors.penaltyPoints && (

              <p className="text-red-400 text-sm mt-2">

                {errors.penaltyPoints}

              </p>

            )
          }

        </div>

      </div>

      <div className="grid grid-cols-2 gap-5">

        <div>

          <label className="block mb-2">

            Start Date

          </label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border
              ${
                errors.startDate
                  ? "border-red-500"
                  : "border-white/10"
              }
            `}
          />

          {
            errors.startDate && (

              <p className="text-red-400 text-sm mt-2">

                {errors.startDate}

              </p>

            )
          }

        </div>

        <div>

          <label className="block mb-2">

            End Date

          </label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border
              ${
                errors.endDate
                  ? "border-red-500"
                  : "border-white/10"
              }
            `}
          />

          {
            errors.endDate && (

              <p className="text-red-400 text-sm mt-2">

                {errors.endDate}

              </p>

            )
          }

        </div>

      </div>

      {/* ---------------- FORM ---------------- */}

      {
        type === "form" && (

          <>

            <FieldBuilder
              field={field}
              setField={setField}
              addField={addField}
            />

            {
              fieldError && (

                <p className="text-red-400 text-sm">

                  {fieldError}

                </p>

              )
            }

            {
              errors.formFields && (

                <p className="text-red-400 text-sm">

                  {errors.formFields}

                </p>

              )
            }

          </>

        )
      }

      {/* ---------------- WORKSHOP ---------------- */}

      {
        type === "workshop" && (

          <div className="space-y-6">

            <div>

              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                className={`
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/5
                  border
                  ${
                    errors.venue
                      ? "border-red-500"
                      : "border-white/10"
                  }
                `}
              />

              {
                errors.venue && (

                  <p className="text-red-400 text-sm mt-2">

                    {errors.venue}

                  </p>

                )
              }

            </div>

            <div className="grid grid-cols-2 gap-5">
                            <div>

                <label className="block mb-2">

                  Start Time

                </label>

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`
                    w-full
                    p-4
                    rounded-2xl
                    bg-white/5
                    border
                    ${
                      errors.startTime
                        ? "border-red-500"
                        : "border-white/10"
                    }
                  `}
                />

                {
                  errors.startTime && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.startTime}
                    </p>
                  )
                }

              </div>

              <div>

                <label className="block mb-2">

                  End Time

                </label>

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`
                    w-full
                    p-4
                    rounded-2xl
                    bg-white/5
                    border
                    ${
                      errors.endTime
                        ? "border-red-500"
                        : "border-white/10"
                    }
                  `}
                />

                {
                  errors.endTime && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.endTime}
                    </p>
                  )
                }

              </div>

            </div>

            <div>

              <label className="block mb-2">

                Registration Deadline

              </label>

              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className={`
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/5
                  border
                  ${
                    errors.registrationDeadline
                      ? "border-red-500"
                      : "border-white/10"
                  }
                `}
              />

              {
                errors.registrationDeadline && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.registrationDeadline}
                  </p>
                )
              }

            </div>

            <select
              name="attendanceMethod"
              value={formData.attendanceMethod}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <option value="manual">Manual</option>
              <option value="qr">QR Code</option>
              <option value="future">Future</option>
            </select>

            <div>

              <input
                type="number"
                name="maxParticipants"
                placeholder="Maximum Participants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className={`
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/5
                  border
                  ${
                    errors.maxParticipants
                      ? "border-red-500"
                      : "border-white/10"
                  }
                `}
              />

              {
                errors.maxParticipants && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.maxParticipants}
                  </p>
                )
              }

            </div>

            <div>

              <h3 className="text-xl font-semibold mb-3">

                Requirements

              </h3>

              <div className="flex gap-3">

                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => {

                    setRequirement(e.target.value);

                    setRequirementError("");

                  }}
                  placeholder="Laptop"
                  className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10"
                />

                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-6 rounded-2xl bg-cyan-500"
                >
                  Add
                </button>

              </div>

              {
                requirementError && (
                  <p className="text-red-400 text-sm mt-2">
                    {requirementError}
                  </p>
                )
              }

              <div className="flex flex-wrap gap-2 mt-4">

                {
                  formData.requirements.map((req,index)=>(
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300"
                    >
                      {req}
                    </span>
                  ))
                }

              </div>

            </div>

            <FieldBuilder
              field={field}
              setField={setField}
              addField={addField}
            />

            {
              fieldError && (
                <p className="text-red-400 text-sm">
                  {fieldError}
                </p>
              )
            }

          </div>

        )
      }

      {/* ---------------- ASSIGNMENT ---------------- */}

      {
        type === "assignment" && (

          <div className="space-y-6">

            <div>

              <textarea
                name="instructions"
                rows="4"
                placeholder="Instructions"
                value={formData.instructions}
                onChange={handleChange}
                className={`
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/5
                  border
                  ${
                    errors.instructions
                      ? "border-red-500"
                      : "border-white/10"
                  }
                `}
              />

              {
                errors.instructions && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.instructions}
                  </p>
                )
              }

            </div>

            <select
              name="submissionType"
              value={formData.submissionType}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <option value="pdf">PDF</option>
              <option value="zip">ZIP</option>
              <option value="link">GitHub / Link</option>
            </select>

            <FieldBuilder
              field={field}
              setField={setField}
              addField={addField}
            />

            {
              fieldError && (
                <p className="text-red-400 text-sm">
                  {fieldError}
                </p>
              )
            }

          </div>

        )
      }

      {/* ---------------- FORM PREVIEW ---------------- */}

      {
        formData.formFields.length > 0 && (

          <div>

            <h3 className="text-2xl font-semibold mb-4">

              Form Preview

            </h3>

            <div className="space-y-3">

              {
                formData.formFields.map((field,index)=>(

                  <div
                    key={index}
                    className="
                      bg-white/5
                      border
                      border-white/10
                      rounded-2xl
                      p-5
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <div>

                      <p className="font-semibold">
                        {field.label}
                      </p>

                      <p className="text-white/50 text-sm">
                        {field.type}
                      </p>

                    </div>

                    {
                      field.required && (
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs">
                          Required
                        </span>
                      )
                    }

                  </div>

                ))
              }

            </div>

          </div>

        )
      }

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-500
        "
      >
        {
          loading
            ? "Saving..."
            : mode === "create"
            ? "Create Activity"
            : "Update Activity"
        }
      </button>

    </form>

  );

}

export default ActivityForm;