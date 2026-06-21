import { useState } from "react";

import FieldBuilder from "./FieldBuilder";

function AssignmentBuilder({ fetchActivities, setSelectedType}) {

  const [loading, setLoading] = useState(false);

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

      instructions: "",

      startDate: "",
      endDate: "",

      startTime: "",
      endTime: "",

      points: "",
      penaltyPoints: "",

      submissionType: "pdf",

      formFields: [],

      type: "assignment",
    });

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
        "Assignment Created"
      );

      setFormData({

        title: "",
        description: "",

        instructions: "",

        startDate: "",
        endDate: "",

        startTime: "",
        endTime: "",

        points: "",
        penaltyPoints: "",

        submissionType: "pdf",

        formFields: [],

        type: "assignment",
      });


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
        Assignment 
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Assignment Title"
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
        name="instructions"
        placeholder="instructions"
        value={formData.instructions}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
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
            <label className="block mb-2 text-white/70">
                Start Date
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
                End Date
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

      <label>
          Submission Type
      </label>
      <select
        name="submissionType"
        value={formData.submissionType}
        onChange={handleChange}
        className="w-full p-4 rounded-2xl bg-white/5"
      >
        <option className="bg-[#151c32] text-white" value="pdf">
          PDF
        </option>

        <option className="bg-[#151c32] text-white" value="zip">
          ZIP
        </option>

        <option className="bg-[#151c32] text-white" value="link">
          GitHub / Link
        </option>

      </select>

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
            : "Create Assignment"
        }
      </button>

    </form>

  );
}

export default AssignmentBuilder;