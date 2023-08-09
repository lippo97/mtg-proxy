import { Button, styled } from "@mui/joy";

export const ArrowButton = styled(Button)({
  width: '10px',
  height: '10px',
  background: 'unset',
  color: 'black',
  '&:hover': {
    background: 'unset',
  },
  '&:focus': {
    background: 'unset',
  },
  '& > MuiSvgIcon-root': {
    color: 'black',
  }
})