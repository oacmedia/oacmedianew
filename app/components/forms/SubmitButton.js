import React from "react";
import { useFormikContext } from "formik";

import Button from "../Button";
import { Keyboard } from "react-native";

function SubmitButton({ title, style }) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      title={title}
      onPress={handleSubmit}
      backgroundColor="light"
      color="dark"
      style={style}
    />
  );
}

export default SubmitButton;
