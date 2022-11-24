import styled from 'styled-components';
import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { mobile } from '../../responsive';
import { validate } from '../../Validate';
import addAvatar from '../../images/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import SignupBg from '../../images/signupBg.jpg';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: url(${SignupBg}) center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  overflow-y: hidden;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  width: 400px;
  padding: 20px;
  margin-bottom: 100px;
  ${mobile({ width: '75%' })}
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 900;
  color: white;
  margin-bottom: 10px;
  display flex;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 400px;
  margin: 20px;
  border-radius: 10px;
  background-color: white;
`;

const Input = styled.input`
  font-weight: 500;
  width: 90%;
  margin: 20px;
  height: 40px;
  outline: none;
  border: none;
  border-bottom: 2px solid gray;
  background-color: transparent;
  color: black;
  :hover {
  }
`;
const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 300;
  font-size: 12px;
  width: 90%;
  margin: 20px;
  height: 40px;
  background-color: transparent;
  color: teal;
  position: relative;
  cursor: pointer;
`;
const Image = styled.img`
  font-weight: 300;
  width: 32px;
  height: 40px;
  object-fit: cover;
  color: black;
`;

const Button = styled.button`
  width: 25%;
  border: 0;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  border-radius: 10px;
  padding: 15px 15px;
  background-color: none;
  color: teal;
  cursor: pointer;
  margin-bottom: 10px;
  opacity: 0.8;
  :hover {
    background-color: none;
    opacity: 1;
    color: teal;
    font-weight: 900;
  }
  &:disabled {
    background-color: none;
    color: teal;
    cursor: not-allowed;
  }
`;

const Link = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  color: #999;
  font-weight: 600;
  cursor: pointer;
  :hover {
    color: khaki;
    transition: 0.5s ease;
  }
`;
const Error = styled.span`
  color: red;
  font-size: 12px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Signup = () => {
  const initialValues = {
    email: '',
    password: '',
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassord] = useState(false);

  const handleTogglePassword = () => setShowPassord(true);
  const handleTogglePassword2 = () => setShowPassord(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // setFormErrors(validate(formValues));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));

    const username = e.target[0].value;
    const file = e.target[3].files[0];
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      ).catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
      const date = new Date().getTime();
      const storageRef = ref(storage, `${username + date}`);
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res?.user, {
              displayName: username,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, 'users', res?.user?.uid), {
              uid: res?.user?.uid,
              displayName: username,
              email: formValues.email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, 'userChats', res?.user?.uid), {});
            navigate('/');
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (error) {}
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Title>SIGN UP</Title>
          <Form onSubmit={handleSubmit}>
            <InputContainer>
              <Input type='text' placeholder='username' />
              {/* <Error>{formErrors.username}</Error> */}
              <Input
                name='email'
                placeholder='valid email'
                type='text'
                onChange={handleChange}
                value={formValues.email}
              />
              <Error>{formErrors.email}</Error>
              <Input
                name='password'
                placeholder='password'
                type={showPassword ? 'text' : 'password'}
                onChange={handleChange}
                value={formValues.password}
                autoComplete='off'
              />
              {!showPassword ? (
                <VisibilityOffOutlined
                  className='showIcon'
                  style={{ color: 'teal' }}
                  onClick={handleTogglePassword}
                />
              ) : (
                <VisibilityOutlined
                  className='showIcon'
                  style={{ color: 'brown' }}
                  onClick={handleTogglePassword2}
                />
              )}
              <Error>{formErrors.password}</Error>
              <Input
                style={{ display: 'none' }}
                name='file'
                placeholder=''
                type='file'
                id='file'
              />
              <Label htmlFor='file'>
                <Image src={addAvatar} alt='avatar' /> Add an avatar
              </Label>
            </InputContainer>
            <Button disabled={loading}>SIGN UP</Button>
            {loading && 'Uploading and compressing the image please wait...'}
            {err && <Error>Invalid Details!</Error>}

            <Link onClick={handleLogin}>Already registered? LOGIN</Link>
          </Form>
        </Wrapper>
      </Container>
    </>
  );
};

export default Signup;
