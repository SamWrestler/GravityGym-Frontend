'use client'
import { useEffect, useState } from 'react'
import PageTitle from '@/components/PageTitle'
import FormLabel from '@/components/FormLabel'
import SubscriptionSelect from '@/components/SubscriptionSelect'
import { useParams } from 'next/navigation'
import { useClass } from '@/hooks/class'
import StatsCard from '@/components/StatsCard'
import Icons from '@/components/Icons'
import Link from 'next/link'
import { useNavigationTitle } from '@/context/NavigationTitleContext'

export default function Main() {
    const params = useParams()
    const { gymClass, loading } = useClass()
    const { data: selectedClass } = gymClass(params?.classId)
    const [athletesCount, setAthletesCount] = useState(0)
    const [instructorCount, setInstructorCount] = useState(0)
    const { setTitle } = useNavigationTitle()

    useEffect(() => {
        if (selectedClass) {
            setTitle(`کلاس ${selectedClass?.name}`)
            setAthletesCount(
                selectedClass?.subscriptions?.reduce((sum, sub) => {
                    const validEnrollments =
                        sub.enrollments?.filter(
                            enroll =>
                                !['expired', 'cancelled'].includes(
                                    enroll?.status,
                                ),
                        ) || []
                    return sum + validEnrollments.length
                }, 0),
            )

            const uniqueInstructors = new Set(
                selectedClass?.subscriptions?.map(sub => sub.instructor_name),
            )
            setInstructorCount(uniqueInstructors.size)
        }
    }, [selectedClass])

    if (loading) return <h2>درحال دریافت اطلاعات</h2>

    return (
        <div className="w-full flex flex-col gap-6">
            <PageTitle firstLine="کلاس" secondLine={selectedClass?.name} />
            <div className="w-full flex flex-col gap-2">
                <FormLabel text="در یک نگاه" />
                <div className="w-full flex items-center gap-2">
                    <div className="w-full flex">
                        <StatsCard title="تعداد اعضای این کلاس">
                            {athletesCount}
                        </StatsCard>
                    </div>
                    <div className="w-full flex">
                        <StatsCard title="تعداد مربیان این کلاس">
                            {instructorCount}
                        </StatsCard>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                <div className="w-full cursor-pointer group  transition-all  flex flex-col desktop:flex-row justify-between gap-2">
                    <FormLabel text="اشتراک‌های این کلاس" />
                    <Link
                        href={`/admin/classes/${params?.classId}/subscription/create`}
                        className=" flex items-center gap-2 text-success group-hover:scale-105 transition-all">
                        <Icons
                            name="plus"
                            className="group-hover:rotate-90 transition-all text-[18px]"
                        />
                        <p>افزودن اشتراک جدید</p>
                    </Link>
                </div>

                <div className="w-full flex flex-col gap-2">
                    {selectedClass?.subscriptions?.map(sub => (
                        <SubscriptionSelect key={sub?.id} sub={sub} />
                    ))}
                </div>
            </div>
        </div>
    )
}
