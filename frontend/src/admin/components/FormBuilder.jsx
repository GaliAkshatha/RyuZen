import { useState } from "react";

import FieldBuilder from "./FieldBuilder";

function FormBuilder({ fetchActivities,}) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      title: "",
      description: "",

      points: "",
      penaltyPoints: "",

      startDate: "",
      endDate: "",

      type: "form",

      formFields: [],
    });



  const [field, setField] =
    useState({

      label: "",

      type: "text",

      required: false,
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

    if (!formData.title.trim()) {
        alert("Title is required");
        return;
    }

    if (!formData.description.trim()) {
        alert("Description is required");
        return;
    }

    if (formData.formFields.length === 0) {
        alert("Add at least one field");
        return;
    }

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

            body:
              JSON.stringify(
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

      fetchActivities();

      console.log(data);

      setFormData({

        title: "",
        description: "",

        points: "",
        penaltyPoints: "",

        startDate: "",
        endDate: "",

        type: "form",

        formFields: [],
      });

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
            <label className="block mb-2 text-white/70">
                Start Date
            </label>

            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="
                    w-full p-4
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                "
            />
        </div>

        <div>
            <label className="block mb-2 text-white/70">
                Due Date
            </label>

            <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="
                    w-full p-4
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                "
            />
        </div>

      </div>



      {/* FIELD BUILDER */}

      <FieldBuilder
        field={field}
        setField={setField}
        addField={addField}
      />



      {/* PREVIEW */}
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
            ? "Creating..."
            : "Create Activity"
        }
      </button>

    </form>
  );
}

export default FormBuilder;