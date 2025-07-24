import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { updateEntry } from "../store/tableSlice";
import { X } from "lucide-react";

export default function EditForm({ rowData, closeModal }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: rowData,
  });

  const onSubmit = (data) => {
    dispatch(updateEntry({ id: rowData.id, updated: data }));
    closeModal();
  };

  return (
    <>
      <X className="w-6 h-6 hover:cursor-pointer" onClick={closeModal} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 flex-col p-4"
      >
        <Input
          {...register("contact_owner", { required: true })}
          placeholder="Contact Owner"
        />
        {errors.contact_owner && <p className="text-red-500">Required</p>}

        <Input
          {...register("account_name", { required: true })}
          placeholder="Account Name"
        />
        {errors.account_name && <p className="text-red-500">Required</p>}

        <Input {...register("name", { required: true })} placeholder="Name" />
        {errors.name && <p className="text-red-500">Required</p>}

        <Input {...register("email", { required: true })} placeholder="Email" />
        {errors.email && <p className="text-red-500">Valid Email Required</p>}

        <Input
          {...register("phone", {
            required: true,
            pattern: {
              value: /^[0-9]{10}$/, // Only 10 digits
              message: "Phone number must be exactly 10 digits",
            },
          })}
          placeholder="Phone"
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </>
  );
}
