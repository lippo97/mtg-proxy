import { Button, styled } from "@mui/joy";

export const ArrowButton = styled(Button)({
  width: '20px',
  height: '20px',
  background: 'unset',
  color: 'black',
  '&:hover': {
    background: 'unset',
  },
  '&:focus': {
    background: 'unset',
  },
  '& > MuiSvgIcon-root': {
    color: 'black'
  }
})