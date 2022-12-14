import { Clear, Search } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useStyles } from "../../styles/theme";

interface SearchToolbar {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

export function SearchToolbar(props: SearchToolbar) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div></div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Procurar Paciente..."
        className={classes.textField}
        InputProps={{
          startAdornment: <Search fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <Clear fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}
