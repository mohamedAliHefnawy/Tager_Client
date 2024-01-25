import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <>
      <div className="w-[100%] h-screen flex justify-center items-center">
        <Spinner
          size="lg"
          label="إنتظار ..."
          color="warning"
          labelColor="warning"
        />
      </div>
    </>
  );
}
