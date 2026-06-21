import { useState } from "react";
import FieldBuilder from "./FieldBuilder";
import { useNavigate } from "react-router-dom";

function ActivityForm({
  type,
  mode = "create",
  initialData = null,
  fetchActivities,
}) {

  const navigate = useNavigate();
  const [loading, setLoading] =
    useState(false);

  const [field, setField] =
    useState({
      label: "",
      type: "text",
      required: false,
    });
  const [requirement, setRequirement] =
   useState("");

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

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  }

  function addField() {

    if (!field.label.trim())
      return;

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

  function addRequirement() {

    if (!requirement.trim())
        return;

    setFormData({

        ...formData,

        requirements: [
            ...formData.requirements,
            requirement,
        ],

    });

    setRequirement("");

    }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      const url =
        mode === "create"
          ? "http://localhost:5000/api/activities"
          : `http://localhost:5000/api/activities/${initialData._id}`;

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

        alert(
          data.message
        );

        return;

      }

      alert(
        mode === "create"
          ? "Activity Created"
          : "Activity Updated"
      );

      fetchActivities?.();

      if (mode === "edit") {

        navigate(
            `/admin/activities/${initialData._id}`
        );

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* BASIC INFO */}

      <input
        type="text"
        name="title"
        placeholder="Activity Title"
        value={formData.title}
        onChange={handleChange}
        className="
          w-full p-4
          rounded-2xl
          bg-white/5
          border border-white/10
        "
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        className="
          w-full p-4
          rounded-2xl
          bg-white/5
          border border-white/10
        "
      />

      <div className="grid grid-cols-2 gap-5">

        <input
          type="number"
          name="points"
          placeholder="Reward Points"
          value={formData.points}
          onChange={handleChange}
          className="
            p-4 rounded-2xl
            bg-white/5
            border border-white/10
          "
        />

        <input
          type="number"
          name="penaltyPoints"
          placeholder="Penalty Points"
          value={formData.penaltyPoints}
          onChange={handleChange}
          className="
            p-4 rounded-2xl
            bg-white/5
            border border-white/10
          "
        />

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
            className="
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border border-white/10
            "
          />

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
            className="
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border border-white/10
            "
          />

        </div>

      </div>

      {/* ACTIVITY SPECIFIC FIELDS */}

      {
        type === "form" && (

        <>
            <FieldBuilder
                field={field}
                setField={setField}
                addField={addField}
            />
        </>

        )
      }

      {
        type === "workshop" && (

            <div className="space-y-6">

            <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                "
            />

            <div className="grid grid-cols-2 gap-5">

                <label>Start Time</label>
                <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="
                     p-4
                     rounded-2xl
                     bg-white/5
                     border border-white/10
                    "
                />
                <label>End Time</label>
                <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="
                      p-4
                      rounded-2xl
                      bg-white/5
                      border border-white/10
                    "
                />

            </div>

            <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                "
            />

            <select
                name="attendanceMethod"
                value={formData.attendanceMethod}
                onChange={handleChange}
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                "
            >
                <option className="bg-[#151c32] text-white" value="manual">Manual</option>
                <option className="bg-[#151c32] text-white" value="qr">QR Code</option>
                <option className="bg-[#151c32] text-white" value="future">Future</option>
            </select>

            <input
                type="number"
                name="maxParticipants"
                placeholder="Maximum Participants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                "
            />

            <div>

                <h3 className="text-xl font-semibold mb-3">
                    Requirements
                </h3>

                <div className="flex gap-3">

                    <input
                        type="text"
                        value={requirement}
                        onChange={(e) =>
                          setRequirement(
                            e.target.value
                          )
                        }
                        placeholder="Laptop"
                        className="
                          flex-1
                          p-4
                          rounded-2xl
                          bg-white/5
                        "
                    />

                    <button
                        type="button"
                        onClick={addRequirement}
                        className="
                          px-6
                          rounded-2xl
                          bg-cyan-500
                        "
                    >
                        Add
                    </button>

                </div>

            </div>

            <FieldBuilder
                field={field}
                setField={setField}
                addField={addField}
            />

           </div>

        )
     }

     {
        type === "assignment" && (

            <div className="space-y-6">

                <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Instructions"
                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-white/5
                      border border-white/10
                    "
                />

                <select
                    name="submissionType"
                    value={formData.submissionType}
                    onChange={handleChange}
                    className="
                      w-full
                      p-4
                      rounded-2xl
                      bg-white/5
                      border border-white/10
                    "
                >
                    <option className="bg-[#151c32] text-white" value="pdf">PDF</option>
                    <option className="bg-[#151c32] text-white" value="zip">ZIP</option>
                    <option className="bg-[#151c32] text-white" value="link">GitHub / Link</option>
                </select>

                <FieldBuilder
                    field={field}
                    setField={setField}
                    addField={addField}
                />

            </div>

        )
     }   

     {
        formData.formFields.length > 0 && (

        <div>

            <h3
                className="
                  text-2xl
                  font-semibold
                  mb-4
                "
            >
                Form Preview
            </h3>

            <div className="space-y-3">

            {
                formData.formFields.map(
                (field, index) => (

                <div
                    key={index}
                    className="
                      p-4
                      rounded-2xl
                      bg-white/5
                      border border-white/10
                    "
                >

                    <p>
                      {field.label}
                    </p>

                    <p
                      className="
                        text-white/50
                        text-sm
                      "
                    >
                      {field.type}
                    </p>

                </div>

                )
              )
            }

            </div>

        </div>

        )
     }


      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-4
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