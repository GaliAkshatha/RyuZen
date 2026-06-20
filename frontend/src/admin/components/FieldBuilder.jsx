function FieldBuilder({
  field,
  setField,
  addField,
}) {

  function handleChange(e) {

    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setField({
      ...field,
      [e.target.name]: value,
    });
  }

  return (

    <div
      className="
      bg-white/5
      border border-white/10
      rounded-3xl
      p-6
    "
    >

      <h3 className="text-2xl font-semibold mb-5">
        Add Form Field
      </h3>

      <div className="grid grid-cols-3 gap-4">

        <input
          type="text"
          name="label"
          value={field.label}
          onChange={handleChange}
          placeholder="Field Name"
          className="
            p-4 rounded-2xl
            bg-black/30
            border border-white/10
          "
        />

        <select
           className="
            p-4 rounded-2xl

            bg-[#151c32]
            text-white

            border border-white/10

            outline-none

            focus:border-cyan-400
           "
          name="type"
          value={field.type}
          onChange={handleChange}
          className="
            p-4 rounded-2xl
            bg-black/30
            border border-white/10
          "
        >
          <option className="bg-[#151c32] text-white" value="text">Text</option>
          <option className="bg-[#151c32] text-white" value="number">Number</option>
          <option className="bg-[#151c32] text-white" value="email">Email</option>
          <option className="bg-[#151c32] text-white" value="date">Date</option>
          <option className="bg-[#151c32] text-white" value="textarea">Textarea</option>
        </select>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="required"
            checked={field.required}
            onChange={handleChange}
          />

          Required

        </label>

      </div>

      <button
        type="button"
        onClick={addField}
        className="
          mt-5
          px-6 py-3
          rounded-2xl
          bg-cyan-500
          hover:bg-cyan-400
        "
      >
        Add Field
      </button>

    </div>
  );
}

export default FieldBuilder;