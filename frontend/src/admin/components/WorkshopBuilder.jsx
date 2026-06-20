import { useState } from "react";

import FieldBuilder from "./FieldBuilder";

function WorkshopBuilder({ fetchActivities }) {

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

      if (fetchActivities) {
        await fetchActivities();
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
        Workshop Builder
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

      <div className="grid grid-cols-2 gap-5">

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="p-4 rounded-2xl bg-white/5"
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="p-4 rounded-2xl bg-white/5"
        />

      </div>

      <div className="grid grid-cols-2 gap-5">

        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="p-4 rounded-2xl bg-white/5"
        />

        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="p-4 rounded-2xl bg-white/5"
        />

      </div>

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
        <option value="manual">
          Manual
        </option>

        <option value="qr">
          QR Code
        </option>

        <option value="future">
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

      <FieldBuilder
        field={field}
        setField={setField}
        addField={addField}
      />

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