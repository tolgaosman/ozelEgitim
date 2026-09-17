<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Yeni bir ön görüşme talebi geldiğinde merkez ekibini bilgilendirir.
 * `ShouldQueue` sayesinde SMTP gecikmesi ziyaretçinin gördüğü form yanıtını
 * bekletmez; kuyruk işçisi çalışmasa bile talep veritabanına yazılmış olur.
 */
final class InquiryReceivedMail extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public function __construct(public readonly Inquiry $inquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Yeni ön görüşme talebi — {$this->inquiry->parent_full_name}",
            // Ekip doğrudan "Yanıtla" diyerek veliye dönebilsin diye.
            replyTo: [$this->inquiry->email],
        );
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.inquiry-received');
    }
}
