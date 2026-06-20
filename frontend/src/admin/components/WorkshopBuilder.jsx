import { useState } from "react";

import FieldBuilder from "./FieldBuilder";

function WorkshopBuilder({ fetchActivities, setSelectedType}) {

  const [loading, setLoading] = useState(false);

  const [requirement, setRequirement] =
    useState("");

  const [field, setField] =
    useState({
      label: "",
      type: "text",
      required: false,
    });

  const [formData, setFormData] =
    useState({

      title: "",
      description: "",

      venue: "",

      startDate: "",
      endDate: "",

      startTime: "",
      endTime: "",

      registrationDeadline: "",

      attendanceMethod: "manual",

      maxParticipants: "",

      points: "",
      penaltyPoints: "",

      requirements: [],

      formFields: [],

      type: "workshop",
    });

  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
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

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await fetch(
          "http://localhost:5000/api/activities",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.message);
        return;

      }

      alert(
        "Workshop Created"
      );

      setFormData({

        title: "",
        description: "",

        venue: "",

        startDate: "",
        endDate: "",

        startTime: "",
        endTime: "",

        registrationDeadline: "",

        attendanceMethod: "manual",

        maxParticipants: "",

        points: "",
        penaltyPoints: "",

        requirements: [],

        formFields: [],

        type: "workshop",
      });

      setRequirement("");

      setField({
        label: "",
        type: "text",
        required: false,
      });

      if (fetchActivities) {
        await fetchActivities();
      }

      if (setSelectedType) {
        setSelectedType("");
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
      className="space-y-6"
    >

      <h2 className="text-3xl font-bold">
        Workshop 
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Workshop Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
      />

      <textarea
        name="description"
        placeholder="Description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
      />

      <input
        type="text"
        name="venue"
        placeholder="Venue"
        value={formData.venue}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
      />

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

      <div className="grid grid-cols-2 gap-5">
        <div>
            <label className="block mb-2 text-white/70">
                Workshop Start Date
            </label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-white/5"
            />

        </div>

        <div>
            <label className="block mb-2 text-white/70">
                Workshop End Date
            </label>

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="p-4 rounded-2xl bg-white/5"
            />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-5">
        
        <label>Start Time</label>

        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="p-4 rounded-2xl bg-white/5"
        />

        <label>End Time</label>

        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="p-4 rounded-2xl bg-white/5"
        />

      </div>
        <label className="block mb-2 text-white/70">
            Registration Deadline
        </label>
      <input
        type="date"
        name="registrationDeadline"
        value={formData.registrationDeadline}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
      />

      <select
        name="attendanceMethod"
        value={formData.attendanceMethod}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
      >
        <option className="bg-[#151c32] text-white" value="manual">
          Manual
        </option>

        <option className="bg-[#151c32] text-white" value="qr">
          QR Code
        </option>

        <option className="bg-[#151c32] text-white" value="future">
          Future
        </option>

      </select>

      <input
        type="number"
        name="maxParticipants"
        placeholder="Maximum Participants"
        value={formData.maxParticipants}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
      />

      <div>

        <h3 className="text-xl mb-3">
          Requirements
        </h3>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Laptop"
            value={requirement}
            onChange={(e) =>
              setRequirement(
                e.target.value
              )
            }
            className="
              flex-1
              p-4
              rounded-2xl
              bg-white/5
            "
          />

          <button
            type="button"
            onClick={
              addRequirement
            }
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

      <div className="mt-4 flex flex-wrap gap-2">

        {formData.requirements.map(
            (req, index) => (

            <span
                key={index}
                className="
                px-3 py-1
                rounded-full
                bg-cyan-500/20
                text-cyan-300
                "
            >
                {req}
            </span>

            )
        )}

      </div>

      <FieldBuilder
        field={field}
        setField={setField}
        addField={addField}
      />

      <div>
        
         <h3 className="text-2xl font-semibold mb-4">
            Form Preview
         </h3>
      <div className="space-y-3">

        {formData.formFields.map((field, index) => (
      <div
        key={index}
        className="
        bg-white/5
        border border-white/10
        rounded-2xl
        p-5

        flex justify-between
        items-center

        hover:border-cyan-400/50
        transition-all
        "
      >

       <div>

        <p className="font-semibold text-lg">
            {field.label}
        </p>

        <p className="text-white/50 text-sm">
            {field.type}
        </p>

       </div>

       <div className="flex gap-2">

        {field.required && (
            <span
                className="
                px-3 py-1
                rounded-full
                bg-red-500/20
                text-red-300
                text-xs
                "
            >
                Required
            </span>
        )}

       </div>

        </div>
        ))}
        </div>
      </div>

      <button
        type="submit"
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
            ? "Creating..."
            : "Create Workshop"
        }
      </button>

    </form>

  );
}

export default WorkshopBuilder;