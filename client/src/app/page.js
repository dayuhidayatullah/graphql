'use client'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql,loadErrorMessages, loadDevMessages, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
// import Cookies from 'universal-cookie';
import { useCookies, Cookies, CookiesProvider } from 'react-cookie';

// Define your GraphQL query
const getToken = gql`
  query GetToken($email: String!) {
    getToken(email: $email) {
      token
      expired
      email
    }
  }
 
`;
const GET_USER = gql`
  query GetUser($tokenId: String! $email: String!) {
    getUser(tokenId: $tokenId email: $email){
      name
      memberNo
    }
  }
`;
const GET_PAYMENT = gql`
  query GetPayment($memberNo: Int!) {
    getPayment(memberNo: $memberNo){
      memberNo
      amount
    }
  }
`

function GetToken({email, setDisplay}) {
  const [cookies, setCookies] = useCookies()

  const  [ getTokenUser,{ data, loading, error, refetch,}] = useLazyQuery(getToken)
  useEffect(() => {
    getTokenUser({variables: {email: email}})    
  }, [])
  useEffect(() => {
    if(!cookies.token) {
      console.info(cookies, '<<<< cookiessss masuk')
      refetch({variables: {email: email}})

    }
  }, [cookies])
  useEffect(() => {
    if(data?.getToken?.token){
      const expirationTime = new Date(Date.now() + data.getToken.expired * 1000);
      console.info(expirationTime.getSeconds(), '<<< apa dia')
      setCookies('token', data.getToken.token, {expires: expirationTime})
      setDisplay('user')
    }
  }, [data])
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
}
function User({email, onClickEmail}) {
  const cookies = new Cookies()
  const { data, loading, error} = useQuery(GET_USER, {variables: {tokenId: cookies.get('token') , email: email}})
  useEffect(() => {
    if(data?.getUser?.memberNo){
      cookies.set('memberNo', data.getUser.memberNo)
    }
  }, [data])
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <div onClick={onClickEmail} className='cursor-pointer'>
      <p
      className='border-[2px] border-gray-100 p-10 w-[400px] text-center'
      >{email}</p>
    </div>
  ) 
}
function Payment() {
  const cookies = new Cookies()
  const { data, loading, error} = useQuery(GET_PAYMENT, {variables: {memberNo: cookies.get('memberNo')}})
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <div className='flex flex-col gap-5'>
      <button className='border-gray-100 p-10 rounded-xl border-[2px] w-[400px]'>{data?.getPayment?.memberNo}</button>
      <button className='border-gray-100 p-10 rounded-xl border-[2px] w-[400px]'>{data?.getPayment?.amount}</button>
    </div>
  );
}
// Create an ApolloClient instance
const client = new ApolloClient({
  uri: 'https://graphql-leg67te7x-dayuhidayatullahs-projects.vercel.app/', // Your GraphQL server endpoint
  cache: new InMemoryCache(),
});

// Main component
export default function Home() {
  const [cookies, _] = useCookies()
  const email = 'test@mail.com'
  const [display, setDisplay] = useState('token')
  const onClickEmail = () => {
    setDisplay('payment')
  }
  const DisplayComponent = useMemo(() => {
    switch(display){
     case 'user': {
      if(cookies?.token) return <User email={email} onClickEmail={onClickEmail} />
      else return <GetToken setDisplay={setDisplay} email={email}></GetToken>
     }
     case 'payment':{
      if(cookies?.token) return <Payment />
      else return <GetToken setDisplay={setDisplay} email={email}></GetToken>
     }
     default :
     return <GetToken setDisplay={setDisplay} email={email}></GetToken>
    }
  }, [display, cookies])
  
  useEffect(() => {
    console.info(display, '<<< display')
  }, [display])
  return (
    <ApolloProvider client={client}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <div className='flex justify-center items-center h-[100vh] flex-col gap-5'>
          {DisplayComponent}
        </div>
      </CookiesProvider>
    </ApolloProvider>
  );
}

