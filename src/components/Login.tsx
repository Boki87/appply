import { useState, SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  useToast,
  Text,
  HStack,
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { BsGoogle } from 'react-icons/bs'
import { signInWithGoogle, signIn } from '../lib/firebase'

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CBsGoogle = chakra(BsGoogle);



const Login = () => {

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const toast = useToast()


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await signIn(email, password)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
      toast({
        title: 'Warning!',
        description: "Incorrect credentials",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const inputChangeHandler = (e: SyntheticEvent) => {
    let input = (e.target as HTMLInputElement)

    if (input.name == 'email') {
      setEmail(input.value)
    }

    if (input.name == 'password') {
      setPassword(input.value)
    }
  }

  return (
    <Flex
      flexDirection="column"
      width="full"
      height="full"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="blue.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p="6"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              rounded="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input value={email} required name="email" onInput={inputChangeHandler} type="email" placeholder="email address" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    name="password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onInput={inputChangeHandler}
                    required
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/*
      <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
      */}
              </FormControl>
              <HStack>
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                  flex="1"
                  isLoading={loading}
                >
                  Login
                </Button>
                <Text>or</Text>
                <Button
                  onClick={signInWithGoogle}
                  isLoading={loading}
                >
                  <CBsGoogle />
                </Button>
              </HStack>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to here?{" "}
        <Text color="blue.500" _hover={{ textDecoration: 'underline' }} as="span">
          <Link to="/signup">
            Sign Up
          </Link>
        </Text>
      </Box>
    </Flex>
  )
}


export default Login
