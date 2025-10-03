import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import confetti from 'canvas-confetti'
import { useContext } from 'react'
import { UserContext } from './UserContext'


const Authentication = ({ openAuth, setOpenAuth }) => {
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState(null)
  const [inputOtp, setInputOtp] = useState('')
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [isSending, setIsSending] = useState(false);


  const otpInputRef = useRef(null)
  const { currentUser } = useContext(UserContext)
  console.log(currentUser)

 

  // Reset state when modal closes
  useEffect(() => {
    if (!openAuth) {
      setStep(1)
      setOtp(null)
      setInputOtp('')
      setError('')
      setTimer(0)

    }
  }, [openAuth])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

const generateOTP = async () => {
  setIsSending(true)
  try {
    const res = await fetch('http://localhost:7000/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email }),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success('OTP sent! Check your email.')
      setStep(2)
      setTimer(300) // 5 minutes
    } else {
      toast.error(data.message || 'Failed to send OTP')
    }
  } catch (err) {
    console.error(err)
    toast.error('Failed to send OTP')
  }
  finally {
    setIsSending(false)
  }
}


const confirmOTP = async () => {
  try {
    const res = await fetch('http://localhost:7000/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email, otp: inputOtp }),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success('2FA enabled successfully!')
      confetti()
      setStep(3)
      setTimeout(() => setOpenAuth(false), 1500)
    } else {
      toast.error(data.message)
      shakeInput()
    }
  } catch (err) {
    console.error(err)
    toast.error('Failed to verify OTP')
  }
}


  const shakeInput = () => {
    if (!otpInputRef.current) return
    otpInputRef.current.classList.add('animate-shake')
    setTimeout(() => otpInputRef.current.classList.remove('animate-shake'), 500)
  }

  const resendOTP = () => {
    generateOTP()
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
      openAuth ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      <div onClick={() => setOpenAuth(false)} className='bg-black/40 absolute inset-0 backdrop-blur-sm'></div>

      <section className='bg-white relative z-40 shadow-lg rounded-3xl p-6 w-[350px] sm:w-[400px]'>
        <button onClick={() => setOpenAuth(false)} className='absolute top-4 right-4 cursor-pointer'>
          ✕
        </button>

        <div className='flex flex-col items-center mb-6'>
          <div className='bg-red-600 p-4 rounded-full mb-2'>
            <svg className='fill-white' xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px"><path d="M120-160v-112q0-34 17.5-62.5T184-378q62-31 126-46.5T440-440q20 0 40 1.5t40 4.5q-4 58 21 109.5t73 84.5v80H120ZM760-40l-60-60v-186q-44-13-72-49.5T600-420q0-58 41-99t99-41q58 0 99 41t41 99q0 45-25.5 80T790-290l50 50-60 60 60 60-80 80ZM440-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm300 80q17 0 28.5-11.5T780-440q0-17-11.5-28.5T740-480q-17 0-28.5 11.5T700-440q0 17 11.5 28.5T740-400Z"/></svg>
          </div>
          <p className='font-bold text-2xl text-slate-800 text-center'>Two-Factor Authentication</p>
        </div>

        {step === 1 && (
          <div className='flex flex-col items-center gap-4'>
            <p>We’ll send you a 6-digit OTP to verify</p>
            <button disabled={isSending} onClick={generateOTP} className='bg-red-600 text-white p-3 rounded-md w-full transition active:scale-95 cursor-pointer'>{isSending ? 'Sending OTP...' : 'Send OTP'}</button>
          </div>
        )}

        {step === 2 && (
          <div className='flex flex-col items-center gap-2'>
            <p>Enter the OTP code below:</p>
            <input
              ref={otpInputRef}
              placeholder='OTP code'
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              type="number"
              className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition'
            />
            <p>{otp}</p>
            {error && <p className='text-red-600 text-sm'>{error}</p>}
            <p className='text-sm text-gray-500'>Expires in: {Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}</p>
            <button onClick={confirmOTP} className='bg-red-600 text-white p-3 rounded-md w-full mt-2 transition active:scale-95 cursor-pointer'>Confirm OTP</button>
            <button onClick={resendOTP} disabled={timer>0} className='text-sm mt-2 text-blue-600 disabled:text-gray-400 hover:underline cursor-pointer'>Resend OTP</button>
          </div>
        )}

        {step === 3 && (
          <div className='flex flex-col items-center gap-2'>
            🎉 2FA enabled successfully!
          </div>
        )}
      </section>
    </div>
  )
}

export default Authentication
