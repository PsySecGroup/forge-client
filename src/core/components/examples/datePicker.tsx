import { Box, TextField } from "@suid/material";
import { createSignal } from "solid-js";

export default function StateTextFields() {
  const [date, setDate] = createSignal("");

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        textAlign: "center",
      }}
      novalidate
      autocomplete="off"
    >
      <div>
        <TextField
          label="Controlled date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date()}
          onChange={(event, value) => setDate(value)}
          helperText={date()}
        />
      </div>
    </Box>
  );
}
